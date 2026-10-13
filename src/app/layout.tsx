import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Menu Tree System | CLOIT",
  description: "Hierarchical menu tree management system with infinite nesting support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F9FAFB] text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}