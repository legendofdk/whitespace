import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "WhiteSpace Real Estate",
  description: "UI demo bat dong san cao cap bang Next.js"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
