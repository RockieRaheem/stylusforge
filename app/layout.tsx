import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "StylusForge - Build The Future of Smart Contracts",
  description: "Write Rust. Deploy Instantly. Save Gas. The ultimate browser-based IDE and learning platform for Arbitrum Stylus.",
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
      <body className="bg-background-dark text-gray-200 font-display">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
