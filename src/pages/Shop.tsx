import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import { ScrollReveal } from '../components/ScrollReveal';
import { useSEO } from '../hooks/useSEO';

export function Shop() {
    useSEO({
        title: 'Shop Wearable Blanket Hoodies Online – Cozee™ India',
        description: 'Browse Cozee™ oversized wearable hoodies in Navy, Grey, Black & Pink. Premium sherpa fleece. ₹2,199 only. Free shipping across India.',
        canonical: 'https://thecozee.in/shop',
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const initialCategory = searchParams.get('category') || 'All';
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    // Sync URL changes to the active category
    useEffect(() => {
        const categoryQuery = searchParams.get('category');
        if (categoryQuery) {
            setActiveCategory(categoryQuery);
        }
    }, [searchParams]);

    const handleCategoryChange = (cat: string) => {
        setActiveCategory(cat);
        setSearchParams({ category: cat });
    };

    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="pt-8 pb-20">
            <ScrollReveal width="100%">
                <h1 className="text-5xl md:text-7xl font-bold leading-none mb-8 md:mb-12 tracking-tighter text-[var(--color-rojo)]">Shop</h1>
            </ScrollReveal>

            {/* Filters & Search */}
            <div className="flex justify-between items-center border-b border-[var(--color-rojo)]/20 pb-4 mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-lg md:text-xl font-medium hover:opacity-70 transition-opacity cursor-pointer flex items-center gap-2 text-[var(--color-rojo)]"
                >
                    Filters {showFilters ? '-' : '+'}
                </button>
                <div className="flex items-center gap-3 text-[var(--color-rojo)]/50 focus-within:text-[var(--color-rojo)] transition-colors">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none placeholder:text-[var(--color-rojo)]/50 text-[var(--color-rojo)] w-24 focus:w-48 md:w-32 md:focus:w-64 transition-all text-lg md:text-xl"
                    />
                </div>
            </div>

            {/* Categories Panel */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-40 opacity-100 mb-8 md:mb-12' : 'max-h-0 opacity-0 mb-4 md:mb-8'}`}>
                <div className="flex flex-wrap gap-3 pt-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`text-base md:text-lg px-5 py-2 rounded-full border border-[var(--color-rojo)] transition-colors cursor-pointer ${activeCategory === cat
                                ? 'bg-[var(--color-rojo)] text-[var(--color-crema)]'
                                : 'hover:bg-[var(--color-rojo)]/10 text-[var(--color-rojo)]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Standardized Product Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:gap-y-16">
                {filteredProducts.map((product, idx) => (
                    <ScrollReveal key={product.id} width="100%" delay={idx % 4 * 0.1}>
                        <Link to={`/product/${product.id}`} className="group cursor-pointer flex flex-col transform transition-all duration-500 hover:-translate-y-2">
                            <div
                                className="aspect-square overflow-hidden mb-4 rounded-3xl relative bg-transparent group-hover:shadow-2xl transition-shadow duration-500"
                            >
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply object-contain p-4"
                                    referrerPolicy="no-referrer"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-xl md:text-3xl font-extrabold text-[var(--color-rojo)] leading-tight">
                                    {product.title.split(' - ')[1] || product.title}
                                </span>
                                <span className="text-base md:text-lg font-light text-[var(--color-rojo)] mt-0.5">
                                    Cozee™ Original
                                </span>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xl md:text-2xl font-extrabold text-[var(--color-rojo)]">{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-sm md:text-base line-through opacity-40 font-normal text-[var(--color-rojo)]">{product.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </ScrollReveal>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="col-span-2 py-20 text-center text-xl text-[var(--color-rojo)]/60">
                        No products found matching your criteria.
                    </div>
                )}
            </div>

        </main>
    );
}
