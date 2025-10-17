import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Dropshipping Helper - AI-Powered Product Analysis",
  description: "Analyze products, compare prices, and optimize your dropshipping business with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} noise bg-grid`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster position="bottom-right" />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}