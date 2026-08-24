import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "explainly",
  description: "Type a concept. Get an interactive explainer.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
