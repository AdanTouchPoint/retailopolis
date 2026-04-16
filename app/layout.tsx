import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
    icon: "/img/favicong.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2124396274984399');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2124396274984399&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <header className="absolute top-0 w-full flex justify-center py-6 sm:py-8 z-50 pointer-events-none">
          <img
            src="/img/logo.png"
            alt="Getin Logo"
            className="h-10 sm:h-12 object-contain pointer-events-auto drop-shadow-sm"
          />
        </header>
        {children}
        <Script 
          type="text/javascript" 
          async 
          src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/ca41abc6-691c-4603-a744-8ec65b2c4eb0-loader.js" 
        />
      </body>
    </html>
  );
}
