import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const resumeUrl = new URL("/resume", request.url);
  return NextResponse.redirect(resumeUrl, { status: 307 });
}
