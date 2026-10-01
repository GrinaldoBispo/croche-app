import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "success", web: "croche-app", sheets: !!process.env.APPS_SCRIPT_URL });
}
