import type { Metadata, Viewport } from 'next';
import { Varela_Round, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const varelaRound = Varela_Round({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-varela'
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FEE77B'
};

export const metadata: Metadata = {
  title: 'MentalMath | Gimnasio de Cálculo Mental en Vivo & Abierto',
  description: 'Compite y entrena en tiempo real con retos de cálculo mental de código abierto. Inspirado en la estética abierta de Precious Plastic y la agilidad de Moravec.',
  keywords: ['cálculo mental', 'matemáticas', 'precious plastic', 'open source', 'tiempo real', 'gamificación', 'educación'],
  authors: [{ name: 'MentalMath Team' }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${varelaRound.variable} ${plusJakartaSans.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-sans antialiased bg-[#FBF9F5] text-[#1C1D1F] min-h-screen selection:bg-[#FEE77B] selection:text-[#1C1D1F]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
