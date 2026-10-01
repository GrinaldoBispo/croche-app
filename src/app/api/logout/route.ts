import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ status: "success" });
  res.cookies.set("croche_user", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
