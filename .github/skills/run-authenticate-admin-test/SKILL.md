---
name: run-authenticate-admin-test
description: Run the Vitest unit tests for the authenticateAdmin function in lib/auth.ts.
---

# Run the authenticateAdmin test

Run the focused Vitest test file for `authenticateAdmin`:

```powershell
npm test -- lib/auth.test.ts
```

The test verifies that:

- Matching admin credentials are accepted.
- Incorrect passwords are rejected.
- Missing or invalid credentials are rejected.
- Login is rejected when no admin account is configured.

Report the Vitest result, including any failing test names and error output. Do not run the full test suite unless the focused test cannot be executed.
