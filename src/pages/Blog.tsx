import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { ScrollReveal } from '../components/ScrollReveal';
import { useSEO } from '../hooks/useSEO';

export function Blog() {
  useSEO({
    title: 'Journal – Cozy Living Tips & Winter Guides | Cozee™',
    description: 'Explore the Cozee™ Journal for winter style tips, gift guides, fabric education, and everything about wearable blanket hoodies in India.',
    canonical: 'https://thecozee.in/blog',
  });

  return (
    <main className="pt-8 pb-20">
      <ScrollReveal width="100%">
        <h1 className="text-5xl md:text-7xl font-bold leading-none mb-4 md:mb-6 tracking-tighter text-[var(--color-rojo)]">
          Journal
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-rojo)]/60 mb-12 md:mb-16 max-w-2xl">
          Tips, guides, and stories about cozy living, winter fashion, and the art of staying warm.
        </p>
      </ScrollReveal>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {blogPosts.map((post, idx) => (
          <ScrollReveal key={post.slug} width="100%" delay={idx % 2 * 0.15}>
            <Link
              to={`/blog/${post.slug}`}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-[var(--color-rojo)]/5 mb-5 relative group-hover:shadow-xl transition-shadow duration-500">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-contain p-8 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest bg-[var(--color-rojo)] text-[var(--color-crema)] px-3 py-1.5 rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex items-center gap-3 text-sm text-[var(--color-rojo)]/50 mb-2">
                <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-rojo)]/30"></span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-[var(--color-rojo)] mb-2 group-hover:opacity-70 transition-opacity leading-tight">
                {post.title}
              </h2>

              <p className="text-base text-[var(--color-rojo)]/60 leading-relaxed mb-3 line-clamp-2">
                {post.excerpt}
              </p>

              <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-rojo)] group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                Read More <span className="text-lg">→</span>
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}
