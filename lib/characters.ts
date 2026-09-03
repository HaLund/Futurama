import path from "node:path";
import sql from "mssql/msnodesqlv8";

export type Character = {
  id: number;
  name: string;
  gender: string;
  status: string;
  species: string;
  createdAt: string;
  image: string;
};

const databaseName = "FuturamaCharacters";
const mdfPath = path.join(process.cwd(), "data", "FuturamaCharacters.mdf");
const sqlServer = process.env.SQL_SERVER ?? "localhost";
const sqlInstance = process.env.SQL_INSTANCE ?? "SQLEXPRESS";
const sqlDriver = process.env.SQL_DRIVER ?? "ODBC Driver 17 for SQL Server";
const sqlUser = process.env.SQL_USER;
const sqlPassword = process.env.SQL_PASSWORD;
const hasSqlCredentials = Boolean(
  sqlUser &&
  sqlPassword &&
  sqlUser !== "your-sql-login" &&
  sqlPassword !== "your-sql-password",
);
const connection = {
  server: sqlInstance ? `${sqlServer}\\${sqlInstance}` : sqlServer,
  database: databaseName,
  driver: sqlDriver,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    trustedConnection: !hasSqlCredentials,
  },
  ...(hasSqlCredentials ? { user: sqlUser, password: sqlPassword } : {}),
};

let poolPromise: Promise<sql.ConnectionPool> | undefined;

function asCharacter(row: Record<string, unknown>): Character {
  return {
    id: Number(row.id),
    name: String(row.name),
    gender: String(row.gender),
    status: String(row.status),
    species: String(row.species),
    createdAt: new Date(String(row.createdAt)).toISOString(),
    image: String(row.image),
  };
}

async function connect() {
  if (!poolPromise) {
    poolPromise = (async () => {
      const master = await new sql.ConnectionPool({ ...connection, database: "master" }).connect();
      const escapedPath = mdfPath.replace(/'/g, "''");
      const exists = await master.request()
        .input("databaseName", sql.NVarChar, databaseName)
        .query("SELECT DB_ID(@databaseName) AS id");
      if (!exists.recordset[0]?.id) {
        await master.request().query(
          `CREATE DATABASE [${databaseName}] ON (FILENAME = N'${escapedPath}') FOR ATTACH_REBUILD_LOG`,
        );
      }
      await master.close();

      const pool = await new sql.ConnectionPool(connection).connect();
      await pool.request().query(`
        IF OBJECT_ID(N'dbo.Characters', N'U') IS NULL
        CREATE TABLE dbo.Characters (
          id int NOT NULL PRIMARY KEY,
          name nvarchar(200) NOT NULL,
          gender nvarchar(20) NOT NULL,
          status nvarchar(20) NOT NULL,
          species nvarchar(50) NOT NULL,
          createdAt datetime2(7) NOT NULL,
          image nvarchar(1000) NOT NULL
        )
      `);
      return pool;
    })().catch((error) => {
      poolPromise = undefined;
      throw error;
    });
  }
  return poolPromise;
}

export async function readCharacters(): Promise<Character[]> {
  const result = await (await connect()).request()
    .query("SELECT id, name, gender, status, species, createdAt, image FROM dbo.Characters ORDER BY id");
  return result.recordset.map(asCharacter);
}

export async function createCharacter(value: Omit<Character, "id">): Promise<Character> {
  const result = await (await connect()).request()
    .input("name", sql.NVarChar(200), value.name)
    .input("gender", sql.NVarChar(20), value.gender)
    .input("status", sql.NVarChar(20), value.status)
    .input("species", sql.NVarChar(50), value.species)
    .input("createdAt", sql.DateTime2, new Date(value.createdAt))
    .input("image", sql.NVarChar(1000), value.image)
    .query(`
      INSERT INTO dbo.Characters (id, name, gender, status, species, createdAt, image)
      OUTPUT INSERTED.*
      VALUES (
        (SELECT ISNULL(MAX(id), 0) + 1 FROM dbo.Characters),
        @name, @gender, @status, @species, @createdAt, @image
      )
    `);
  return asCharacter(result.recordset[0]);
}

export async function updateCharacter(value: Character): Promise<Character | undefined> {
  const result = await (await connect()).request()
    .input("id", sql.Int, value.id)
    .input("name", sql.NVarChar(200), value.name)
    .input("gender", sql.NVarChar(20), value.gender)
    .input("status", sql.NVarChar(20), value.status)
    .input("species", sql.NVarChar(50), value.species)
    .input("createdAt", sql.DateTime2, new Date(value.createdAt))
    .input("image", sql.NVarChar(1000), value.image)
    .query(`
      UPDATE dbo.Characters
      SET name = @name, gender = @gender, status = @status,
          species = @species, createdAt = @createdAt, image = @image
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset[0] ? asCharacter(result.recordset[0]) : undefined;
}

export async function deleteCharacter(id: number): Promise<boolean> {
  const result = await (await connect()).request()
    .input("id", sql.Int, id)
    .query("DELETE FROM dbo.Characters WHERE id = @id");
  return result.rowsAffected[0] === 1;
}
