import type { Metadata, Viewport } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";
const lexend = Lexend({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SkillTree",
  description: "Personal learning tracker based on skill mastery",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SkillTree",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${lexend.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
