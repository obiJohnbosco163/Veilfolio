import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StarknetProvider } from "@/providers/StarknetProvider";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Veilfolio — Privacy Portfolio for Starknet",
  description: "One portfolio. Separate identities. Private by design. Shield your DeFi activity with isolated execution identities on Starknet.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
        suppressHydrationWarning
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var t=localStorage.getItem('veilfolio-theme');if(t==='light')document.documentElement.classList.replace('dark','light');else if(t==='system'&&window.matchMedia('(prefers-color-scheme:light)').matches)document.documentElement.classList.replace('dark','light')}catch(e){}})()`,
            }}
          />
        </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <StarknetProvider>
            <PortfolioProvider>
              {children}
            </PortfolioProvider>
          </StarknetProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
