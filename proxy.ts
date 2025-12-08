// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default async function handler(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value; // or access token/cookie you use
  const url = req.nextUrl.clone();

  // define protected routes
  const protectedRoutes = ["/dashboard" /* etc */];
  const pathname = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some(
    (route) => pathname == route || pathname.startsWith(route + "/")
  );
  if (isProtected && !token) {
    // console.log("Unauthorized access attempt to protected route:", pathname);
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }
  if (token && (pathname === "/login" || pathname === "/register")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // run proxy for all requests except Next.js internals and static assets
};