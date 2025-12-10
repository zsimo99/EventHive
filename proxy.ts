// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "./lib/auth";

export default async function handler(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value; // or access token/cookie you use
  const url = req.nextUrl.clone();

  // define protected routes
  const protectedRoutes = ["/dashboard" /* etc */];
  const pathname = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some(
    (route) => pathname == route || pathname.startsWith(route + "/")
  );
  const tokenValide=verifyAccessToken(token || "");
  if (isProtected && !tokenValide) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }
  if (tokenValide && (pathname === "/login" || pathname === "/register")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // run proxy for all requests except Next.js internals and static assets
};