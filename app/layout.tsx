import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "P.E.A. | Faculty & Crew",
  description: "Meet the faculty and crew of Planet Express Academy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
