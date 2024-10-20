import { connectDB } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

connectDB();

export async function GET() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "User Logged Out successfully",
    });
    response.cookies.set("token", "", {
      httpOnly: true,
      sameSite: true,
      secure: true,
      expires: 0,
    });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
