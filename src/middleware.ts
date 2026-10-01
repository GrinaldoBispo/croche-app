import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLICAS = ["/login", "/register", "/api/login", "/api/register", "/api/health"];

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (PUBLICAS.some((p) => path === p || path.startsWith(p + "/"))) return NextResponse.next();
  if (path.startsWith("/api/")) {
    if (!req.cookies.get("croche_user")) return NextResponse.json({ status: "error", message: "não logado" }, { status: 401 });
    return NextResponse.next();
  }
  if (!req.cookies.get("croche_user")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
