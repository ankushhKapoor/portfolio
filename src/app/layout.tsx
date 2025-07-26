import "./globals.css";
import { getUrl } from "@/utilities/getUrl";
import { Geist_Mono, Geist } from "next/font/google";
import { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

type Props = {
  children: React.ReactNode;
};

const GeistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="q462Bi-qAx4ZBjIAJmk8RGPwMAAnXk3-Z7eMaTL8GHY" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-geist-sans bg-white overscroll-none dark:bg-zinc-900">
        <ThemeProvider defaultTheme="system" storageKey="ahmet-theme">
          {children}
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
};

export default RootLayout;

export const viewport: Viewport = {
  themeColor: "#ffffff",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getUrl),
  title: {
    default: "Ankush Kapoor | Computer Engineering Student | Based in India",
    template: `%s - Ankush Kapoor | Computer Engineering Student | Based in India`,
  },
  description: "Explore my projects and previous work, or contact me.",
};
