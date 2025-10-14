import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Protect these routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/analyze-image",
    "/api/compare-prices",
    "/api/verify-supplier",
    "/api/shipping",
    "/api/reviews",
    "/api/seo-desc",
    "/api/competitors"
  ]
}