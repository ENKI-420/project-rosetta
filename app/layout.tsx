import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Rosetta | DNA-Lang",
  description: "Sovereign interface for quantum-biological DNA-Lang organisms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
