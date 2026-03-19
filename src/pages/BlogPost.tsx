import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import { useSEO } from '../hooks/useSEO';
import { useMemo } from 'react';

export function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  const articleSchema = useMemo(() => {
    if (!post) return undefined;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: `https://thecozee.in${post.image}`,
      datePublished: post.date,
      author: { '@type': 'Organization', name: 'Cozee' },
      publisher: {
        '@type': 'Organization',
        name: 'Cozee',
        logo: { '@type': 'ImageObject', url: 'https://thecozee.in/favicon.png' },
      },
    };
  }, [post]);

  useSEO({
    title: post ? `${post.title} | Cozee™ Journal` : 'Post Not Found – Cozee™',
    description: post?.excerpt || 'This blog post could not be found.',
    canonical: post ? `https://thecozee.in/blog/${post.slug}` : undefined,
    ogImage: post ? `https://thecozee.in${post.image}` : undefined,
    ogType: 'article',
    jsonLd: articleSchema,
  });

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-[var(--color-rojo)] mb-4">Post Not Found</h1>
        <p className="text-xl text-[var(--color-rojo)]/70 mb-8">We couldn't find the article you were looking for.</p>
        <Link to="/blog" className="px-8 py-3 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-medium hover:bg-[var(--color-rojo)]/90 transition-colors">
          Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <main className="pb-20">
      <Link to="/blog" className="inline-flex items-center gap-2 text-[var(--color-rojo)]/70 hover:text-[var(--color-rojo)] transition-colors mb-8 group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-lg">Back to Journal</span>
      </Link>

      {/* Article Header */}
      <article className="max-w-3xl">
        <div className="flex items-center gap-3 text-sm text-[var(--color-rojo)]/50 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest bg-[var(--color-rojo)] text-[var(--color-crema)] px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-rojo)]/30"></span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-[var(--color-rojo)] leading-tight mb-8 tracking-tight">
          {post.title}
        </h1>

        {/* Article Body */}
        <div
          className="prose prose-lg max-w-none
            [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:text-[var(--color-rojo)] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight
            [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:text-[var(--color-rojo)] [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:text-[var(--color-rojo)]/80 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-5
            [&_strong]:text-[var(--color-rojo)] [&_strong]:font-bold
            [&_ul]:text-[var(--color-rojo)]/80 [&_ul]:text-lg [&_ul]:space-y-2 [&_ul]:mb-5 [&_ul]:ml-5 [&_ul]:list-disc
            [&_li]:text-[var(--color-rojo)]/80
            [&_a]:text-[var(--color-rojo)] [&_a]:font-bold [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:opacity-70
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-6
            [&_th]:text-left [&_th]:p-3 [&_th]:border-b-2 [&_th]:border-[var(--color-rojo)]/20 [&_th]:text-[var(--color-rojo)] [&_th]:font-bold [&_th]:text-sm [&_th]:uppercase [&_th]:tracking-wider
            [&_td]:p-3 [&_td]:border-b [&_td]:border-[var(--color-rojo)]/10 [&_td]:text-[var(--color-rojo)]/80
            [&_hr]:border-[var(--color-rojo)]/10 [&_hr]:my-8
          "
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* CTA */}
        <div className="mt-12 p-8 md:p-10 bg-[var(--color-rojo)]/5 rounded-3xl border border-[var(--color-rojo)]/10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-rojo)] mb-3">Ready to Get Cozy?</h3>
          <p className="text-lg text-[var(--color-rojo)]/70 mb-6">Experience India's Premium Winterwear and ultimate wearable blanket hoodie, starting at ₹2,199.</p>
          <Link
            to="/shop"
            className="inline-block px-10 py-4 bg-[var(--color-rojo)] text-[var(--color-crema)] rounded-full font-bold text-lg hover:bg-[var(--color-rojo)]/90 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--color-rojo)]/20"
          >
            Shop Cozee™
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      <div className="mt-16 pt-12 border-t border-[var(--color-rojo)]/10">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-rojo)] mb-8">More from the Journal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts
            .filter(p => p.slug !== post.slug)
            .slice(0, 2)
            .map(relatedPost => (
              <Link
                key={relatedPost.slug}
                to={`/blog/${relatedPost.slug}`}
                className="group flex gap-4 items-start"
              >
                <div className="w-24 h-24 shrink-0 rounded-2xl bg-[var(--color-rojo)]/5 overflow-hidden">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-full object-contain p-2 mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-rojo)] text-lg group-hover:opacity-70 transition-opacity leading-tight">
                    {relatedPost.title}
                  </h3>
                  <span className="text-sm text-[var(--color-rojo)]/50 mt-1 block">{relatedPost.readTime}</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}

// Simple markdown-to-HTML renderer
function renderMarkdown(md: string): string {
  let html = md
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Unordered lists
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    // Tables
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return cells.map(c => c.trim()).join('|||TABLE_CELL|||');
    })
    // Horizontal rules
    .replace(/^---$/gm, '<hr />')
    // Paragraphs
    .replace(/^(?!<[hulo]|<li|<hr|<table|<str)(.*\S.*)$/gm, '<p>$1</p>');

  // Handle tables more properly
  const lines = html.split('\n');
  let inTable = false;
  let tableHtml = '';
  const result: string[] = [];

  for (const line of lines) {
    if (line.includes('|||TABLE_CELL|||')) {
      if (!inTable) {
        inTable = true;
        tableHtml = '<table>';
        const cells = line.split('|||TABLE_CELL|||');
        tableHtml += '<thead><tr>' + cells.map(c => `<th>${c.trim()}</th>`).join('') + '</tr></thead><tbody>';
      } else {
        const cells = line.split('|||TABLE_CELL|||');
        // Skip separator rows
        if (cells.every(c => /^[-:\s]+$/.test(c.trim()))) continue;
        tableHtml += '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
      }
    } else {
      if (inTable) {
        inTable = false;
        tableHtml += '</tbody></table>';
        result.push(tableHtml);
        tableHtml = '';
      }
      result.push(line);
    }
  }
  if (inTable) {
    tableHtml += '</tbody></table>';
    result.push(tableHtml);
  }

  return result.join('\n');
}
