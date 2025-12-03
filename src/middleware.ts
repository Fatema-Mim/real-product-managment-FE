// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const isAuthPage = request.nextUrl.pathname.startsWith("/login");
//   const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

//   if (isDashboard && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   if (isAuthPage && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/login"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes("_rsc")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  const isAuthPage = url.pathname.startsWith("/login");
  const isDashboardPage = url.pathname.startsWith("/dashboard");

  
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
