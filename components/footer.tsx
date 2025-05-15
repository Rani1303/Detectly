import Link from "next/link"
import { Microscope } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2 text-lg font-bold">
          <Microscope className="h-5 w-5 text-primary" />
          <span>Detectly</span>
        </div>
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-right">
          &copy; {new Date().getFullYear()} Detectly. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
