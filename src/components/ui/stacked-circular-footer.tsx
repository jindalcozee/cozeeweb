import { Instagram, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function StackedCircularFooter() {
  return (
    <footer className="bg-[var(--color-crema)] py-12 border-t border-[var(--color-rojo)]/20 mt-20 text-[var(--color-rojo)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-[var(--color-rojo)]/10 p-8 text-[var(--color-rojo)]">
            <Cloud className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <nav className="mb-8 flex flex-wrap justify-center items-center gap-6 font-medium">
            <a href="/" className="hover:opacity-70 transition-opacity whitespace-nowrap">Home</a>
            <a href="/#about" className="hover:opacity-70 transition-opacity whitespace-nowrap">About</a>
            <div className="mx-2">
              <Button asChild variant="outline" size="icon" className="rounded-full border-[var(--color-rojo)] text-[var(--color-rojo)] hover:bg-[var(--color-rojo)] hover:text-[var(--color-crema)] bg-transparent w-10 h-10">
                <a href="https://instagram.com/the.cozee" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
            </div>
            <a href="/shop?category=All" className="hover:opacity-70 transition-opacity whitespace-nowrap">Shop</a>
            <a href="/contact" className="hover:opacity-70 transition-opacity whitespace-nowrap">Contact</a>
          </nav>

          <div className="mb-8 w-full max-w-md">
            <form className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  className="rounded-full border-[var(--color-rojo)]/30 bg-transparent text-[var(--color-rojo)] placeholder:text-[var(--color-rojo)]/50 focus-visible:ring-[var(--color-rojo)]"
                />
              </div>
              <Button type="submit" className="rounded-full bg-[var(--color-rojo)] text-[var(--color-crema)] hover:bg-[var(--color-rojo)]/90">
                Subscribe
              </Button>
            </form>
          </div>
          <div className="text-center">
            <p className="text-sm opacity-60">
              © 2025 Cozee™. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { StackedCircularFooter }
