import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'

export function HomePage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">WishlistManager</h1>
      <p className="text-xl text-[hsl(var(--muted-foreground))] mb-8 max-w-md">
        Manage your wishlists from various shopping sites in one place.
      </p>

      {isAuthenticated ? (
        <Link to="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link to="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Login
            </Button>
          </Link>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        <div className="p-6 rounded-lg border border-[hsl(var(--border))]">
          <h3 className="font-semibold mb-2">Easy Registration</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Just paste a URL and product info is automatically fetched.
          </p>
        </div>
        <div className="p-6 rounded-lg border border-[hsl(var(--border))]">
          <h3 className="font-semibold mb-2">Unified Management</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Manage items from any shopping site in one place.
          </p>
        </div>
        <div className="p-6 rounded-lg border border-[hsl(var(--border))]">
          <h3 className="font-semibold mb-2">Stay Organized</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Categorize, prioritize, and track your purchases.
          </p>
        </div>
      </div>
    </div>
  )
}
