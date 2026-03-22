import type { Metadata } from "next";
import { Geist, Geist_Mono, Rubik, Nunito_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Globival Detalles - Regalos y Productos Personalizados",
    template: "%s | Globival Detalles",
  },
  description:
    "Tienda de regalos y productos personalizados. Encuentra el detalle perfecto para cada ocasión.",
  keywords: ["regalos", "productos personalizados", "detalles", "ecommerce", "tienda online"],
  authors: [{ name: "Globival Detalles" }],
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "Globival Detalles",
    title: "Globival Detalles - Regalos y Productos Personalizados",
    description: "Tienda de regalos y productos personalizados. Encuentra el detalle perfecto para cada ocasión.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Globival Detalles",
                  url: "https://globivaldetalles.com",
                  logo: "https://globivaldetalles.com/logo_globival.png",
                  contactPoint: {
                    "@type": "ContactPoint",
                    telephone: "+51967411110",
                    contactType: "customer service",
                    availableLanguage: "Spanish",
                  },
                  sameAs: [
                    "https://www.instagram.com/globival_detalles",
                    "https://www.facebook.com/globivaldetalles",
                    "https://www.tiktok.com/@globival_detalles",
                  ],
                },
                {
                  "@type": "WebSite",
                  name: "Globival Detalles",
                  url: "https://globivaldetalles.com",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://globivaldetalles.com/catalogo?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${nunitoSans.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <ToastContainer position="bottom-right" theme="colored" />
        </ThemeProvider>
      </body>
    </html>
  );
}
