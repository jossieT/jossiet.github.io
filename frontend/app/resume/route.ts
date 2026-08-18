import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Google Drive direct download URL for Yosef's CV
const GOOGLE_DRIVE_DIRECT_URL =
  "https://drive.google.com/uc?export=download&id=1ZHVwzrStKN4wvbYe-GYTJ6AWo1HsUSVz";

export async function GET() {
  try {
    const localPdfPath = path.join(process.cwd(), "public", "resume.pdf");

    // If local resume.pdf exists in public/, serve it directly
    if (fs.existsSync(localPdfPath)) {
      const fileBuffer = fs.readFileSync(localPdfPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="Yosef_Teshome_Resume.pdf"',
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Otherwise, redirect seamlessly to the direct Google Drive download link
    return NextResponse.redirect(new URL(GOOGLE_DRIVE_DIRECT_URL), {
      status: 307,
    });
  } catch (error) {
    console.error("Error in /resume route:", error);
    return NextResponse.redirect(new URL(GOOGLE_DRIVE_DIRECT_URL), {
      status: 307,
    });
  }
}
