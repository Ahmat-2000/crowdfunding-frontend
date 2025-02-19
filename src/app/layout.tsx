import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Navbar from "./components/Navbar";
import { FeedbackProvider } from "./context/feadback";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campaign",
  description:
    "Collect money for a good cause",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
            <main className="container max-w-[1280px] xl:mx-auto px-2">
              <Navbar />
              <FeedbackProvider>    
                {children}
              </FeedbackProvider>
            </main>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
