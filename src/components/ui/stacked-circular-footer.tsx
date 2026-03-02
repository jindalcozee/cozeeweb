import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter, Cloud } from "lucide-react"

function StackedCircularFooter() {
  return (
    <footer className="bg-[var(--color-crema)] py-12 border-t border-[var(--color-rojo)]/20 mt-20 text-[var(--color-rojo)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-[var(--color-rojo)]/10 p-8 text-[var(--color-rojo)]">
            <Cloud className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <nav className="mb-8 flex flex-wrap justify-center gap-6 font-medium">
            <a href="#" className="hover:opacity-70 transition-opacity">Home</a>
            <a href="#" className="hover:opacity-70 transition-opacity">About</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Originals</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Contact</a>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button asChild variant="outline" size="icon" className="rounded-full border-[var(--color-rojo)] text-[var(--color-rojo)] hover:bg-[var(--color-rojo)] hover:text-[var(--color-crema)] bg-transparent">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" className="rounded-full border-[var(--color-rojo)] text-[var(--color-rojo)] hover:bg-[var(--color-rojo)] hover:text-[var(--color-crema)] bg-transparent">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" className="rounded-full border-[var(--color-rojo)] text-[var(--color-rojo)] hover:bg-[var(--color-rojo)] hover:text-[var(--color-crema)] bg-transparent">
              <a href="https://instagram.com/the.cozee" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="icon" className="rounded-full border-[var(--color-rojo)] text-[var(--color-rojo)] hover:bg-[var(--color-rojo)] hover:text-[var(--color-crema)] bg-transparent">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
          </div>
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
              © 2024 The Cozee Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { StackedCircularFooter }
