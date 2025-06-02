import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, Pacifico } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-logo",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.variable} ${pacifico.variable}`}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </main>
  );
}
