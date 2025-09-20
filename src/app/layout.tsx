import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../store/ReduxProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });

export const metadata: Metadata = {
  title: "Apply Digital Test",
  description: "Frontend development test for Apply Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${archivo.variable}`}>
        <ReduxProvider>
          <Header />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
