import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import LoginReminder from "@/components/auth/LoginReminder";

const roboto = Roboto({ weight: ['300', '400', '500', '700', '900'], subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Degree Difference | Find Your Future Institute",
  description: "Verified reviews, detailed fee structures and placement data for top Indian colleges. Make informed academic decisions with Degree Difference.",
  keywords: ["Indian Colleges", "Higher Education", "College Reviews", "Admission 2024", "University Rankings"],
  authors: [{ name: "Degree Difference Team" }],
  openGraph: {
    title: "Degree Difference | Find Your Future Institute",
    description: "Verified reviews, detailed fee structures and placement data for top Indian colleges.",
    url: "https://degreedifference.com",
    siteName: "Degree Difference",
    images: [
      {
        url: "https://degreedifference.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Degree Difference | Find Your Future",
    description: "Verified reviews, detailed fee structures and placement data for top Indian colleges.",
    images: ["https://degreedifference.com/og-image.jpg"],
  },
  metadataBase: new URL("https://degreedifference.com"),
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased bg-gray-50 text-gray-900`}>
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
