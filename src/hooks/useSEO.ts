import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export function useSEO({
  title,
  description,
  canonical,
  ogImage = 'https://thecozee.in/navyyy_transparent.png',
  ogType = 'website',
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    setMeta('description', description);

    // Open Graph
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:site_name', 'Cozee™', 'property');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // Canonical
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }

    // JSON-LD Structured Data
    if (jsonLd) {
      // Remove any existing JSON-LD scripts we've added
      document.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());

      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      // Cleanup JSON-LD on unmount
      document.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());
    };
  }, [title, description, canonical, ogImage, ogType, jsonLd]);
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}
