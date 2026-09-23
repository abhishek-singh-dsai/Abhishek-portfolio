export const dynamic = 'force-static';

export default function sitemap() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [{ url: `${site}/`, changeFrequency: 'monthly', priority: 1 }];
}
