"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Moon, Sun, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Industries", href: "/industries" },
  { name: "Job Board", href: "/jobs" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b bg-background/90 backdrop-blur-xl shadow-sm shadow-primary/5"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm group-hover:scale-110 transition-transform">
              PS
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">Prime</span>
              <span className="text-foreground">Staff</span>
            </span>
          </Link>
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all hover:bg-accent hover:text-primary ${
                  pathname === item.href
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent transition-colors"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-1 mr-2 px-1 py-1 rounded-full bg-muted/50 border border-border/50">
              <Link 
                href="/employer/login" 
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-[11px] h-7 px-3 rounded-full font-semibold"
                )}
              >
                Hire Staff
              </Link>
              <Link 
                href="/login" 
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-[11px] h-7 px-3 rounded-full font-semibold"
                )}
              >
                Find Work
              </Link>
            </div>
            <Link 
              href="/login" 
              className={cn(
                buttonVariants({ size: "sm" }),
                "font-semibold shadow-md shadow-primary/20"
              )}
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "font-semibold border-primary/20 hover:bg-primary/5 text-primary"
              )}
            >
              Sign Up
            </Link>
          </div>

          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "md:hidden"
              )}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-1 mt-8">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    PS
                  </div>
                  <span className="text-lg font-bold">
                    <span className="text-primary">Prime</span>Staff
                  </span>
                </div>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-6 pt-4 border-t flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Link 
                      href="/employer/login" 
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "w-full text-xs"
                      )}
                    >
                      Hire Staff
                    </Link>
                    <Link 
                      href="/login" 
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "w-full text-xs"
                      )}
                    >
                      Find Work
                    </Link>
                  </div>
                  <Link 
                    href="/login" 
                    className={cn(buttonVariants({ size: "default" }), "w-full")}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full")}
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
