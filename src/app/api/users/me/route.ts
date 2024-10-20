import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/helpers/getTokenData";

connectDB();

export async function POST(req: NextRequest) {
  try {
    // extract data from token
    const userId = await getTokenData(req);
    if (!userId) {
      return NextResponse.json({
        error: "no user id found in token",
      });
    }

    const user = await User.findOne({ _id: userId }).select(
      "email username isVerified isAdmin"
    );

    if (!user) {
      return NextResponse.json(
        { error: "no user found with given token" },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 400,
      }
    );
  }
}
