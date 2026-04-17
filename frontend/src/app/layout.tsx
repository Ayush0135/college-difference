import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import LoginReminder from "@/components/auth/LoginReminder";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Degree Difference | Find Your Future",
  description: "Verified reviews, detailed fee structures and placement data for top Indian colleges.",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
            <Navbar />
            {children}
            <AuthModal />
            <LoginReminder />
        </AuthProvider>
      </body>
    </html>
  );
}
