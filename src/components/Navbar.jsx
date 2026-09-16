import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-[var(--c1)]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

            <Link 
                to="/" 
                className="text-2xl font-bold tracking-wide text-white hover:text-[var(--c4)] transition"
            >
                Media Search
            </Link>

            <nav className="flex items-center gap-8">
                <Link
                    to="/"
                    className="text-lg font-medium text-white/80 hover:text-white transition"
                >
                    Search
                </Link>

                <Link
                    to="/collection"
                    className="text-lg font-medium text-white/80 hover:text-white transition"
                >
                    Collection
                </Link>
            </nav>

        </div>
    </header>
  )
}

export default Navbar