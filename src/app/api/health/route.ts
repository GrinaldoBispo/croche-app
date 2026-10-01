import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "success", web: "Croche App", sheets: !!process.env.APPS_SCRIPT_URL });
}
