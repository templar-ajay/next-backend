import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("reqBody", reqBody);
    const { username, email, password } = reqBody;
    if (!username || !email || !password) {
      return NextResponse.json({
        error: "username, email and password are required",
      });
    }
    // validation
    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({
        error: "User with given email already exists",
      });
    }

    user = await User.findOne({ username });
    if (user) {
      return NextResponse.json({
        error: "User with given username already exists",
      });
    }

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("savedUser", savedUser);

    // send verification e-mail
    await sendEmail({ email, emailType: "verifyEmail", userId: savedUser._id });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      savedUser: {
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}
