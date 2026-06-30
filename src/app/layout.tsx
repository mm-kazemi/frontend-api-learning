import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frontend API Learning",
  description: "یادگیری کار با API در Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body>{children}</body>
    </html>
  );
}
