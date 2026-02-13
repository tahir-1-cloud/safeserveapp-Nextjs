import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import {Toaster} from "sonner";
import { Metadata } from 'next';

const outfit = Outfit({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "safeserveapp",
  description: "safeserveapp",
    icons: {
    icon: "favicon.ico", // <- your favicon file in /public
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
         <Toaster position="top-right"/>
      </body>
    </html>
  );
}
