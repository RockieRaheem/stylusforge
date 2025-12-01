import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stylus Studio - Build The Future of Smart Contracts",
  description: "Write Rust. Deploy Instantly. Save Gas. The easiest way to learn, write, and deploy Stylus smart contracts with zero setup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background-dark text-white">
        {children}
      </body>
    </html>
  );
}
