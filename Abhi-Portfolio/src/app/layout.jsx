import { Inter, Lora, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { portfolio } from '@/data/portfolio';
import { isPlaceholder } from '@/lib/asset';
import './globals.css';

// Self-hosted at build time by next/font (no requests to Google at runtime).
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], style: ['italic'], weight: ['500'], variable: '--font-playfair', display: 'swap' });

const { personal } = portfolio;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const role = isPlaceholder(personal.title) ? 'Portfolio' : personal.title;
const title = `${personal.name} · ${role}`;
const description = isPlaceholder(personal.intro) ? `Portfolio of ${personal.name}.` : personal.intro;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  authors: [{ name: personal.name }],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', title, description, siteName: personal.name },
  twitter: { card: 'summary_large_image', title, description },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#121216' },
    { media: '(prefers-color-scheme: light)', color: '#ebedf5' },
  ],
};

const sameAs = [personal.github, personal.linkedin, personal.x, personal.instagram, personal.medium].filter((u) => u && u !== '#');
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: personal.name,
  url: siteUrl,
  ...(isPlaceholder(personal.title) ? {} : { jobTitle: personal.title }),
  ...(personal.email ? { email: `mailto:${personal.email}` } : {}),
  ...(sameAs.length ? { sameAs } : {}),
};

// Runs before paint so a saved light theme never flashes dark. Dark is the default.
const themeScript = `try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.replace('dark','light')}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${jakarta.variable} ${lora.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
