import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Web3Provider } from "./contexts/Web3Provider";
import { WalletProvider } from "./contexts/WalletContext";
import { ProfileProvider } from "./contexts/ProfileContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nosen - Web3 Income Verification Platform",
  description: "Transform your crypto earnings into legitimate documentation with ENS professional identities and employer verification.",
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
        <Web3Provider>
          <WalletProvider>
            <ProfileProvider>
              <ThemeProvider>
                <Navbar />
                {children}
              </ThemeProvider>
            </ProfileProvider>
          </WalletProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
