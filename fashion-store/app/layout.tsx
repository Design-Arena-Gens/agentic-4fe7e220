import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';
import CartProvider from "@/components/CartProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ATELIER - Premium Fashion & Apparel",
  description: "Discover curated collections of premium clothing and footwear for the modern wardrobe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
