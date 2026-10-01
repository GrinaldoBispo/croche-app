import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { status: "pending", message: "login via USUARIOS ainda nao implementado — proxima etapa" },
    { status: 501 }
  );
}
