import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const techSans = Space_Grotesk({
  variable: "--font-tech-sans",
  subsets: ["latin"],
});

const techMono = JetBrains_Mono({
  variable: "--font-tech-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PowerSense — HVAC Anomaly Detection",
  description: "Real-time HVAC and electrical anomaly detection dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${techSans.variable} ${techMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
