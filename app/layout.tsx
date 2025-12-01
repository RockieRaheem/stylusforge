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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-[#111827] text-gray-200 font-display">
        {children}
      </body>
    </html>
  );
}
