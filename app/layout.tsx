import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Retailopoly",
  description: "Juego de Retailopoly",
  icons: {
    icon: "/img/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="absolute top-0 w-full flex justify-center py-6 sm:py-8 z-50 pointer-events-none">
          <img 
            src="/img/logo.png" 
            alt="Getin Logo" 
            className="h-10 sm:h-12 object-contain pointer-events-auto drop-shadow-sm" 
          />
        </header>
        {children}
      </body>
    </html>
  );
}
