import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import { uploadToCloudinary } from "@/utils/cloudinary";
import User from "@/models/User.model";
import { sendMail } from "@/utils/sendMail";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("avatar") as File;
    let user;
    try {
      user = Object.fromEntries(formData);
    } catch (error) {
      return sendError("invalide formdata", 400);
    }
    const emailExists = await User.findOne({ email: user.email });
    if (emailExists) {
      return sendError("email already exists", 400);
    }
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        user.avatar = await uploadToCloudinary(buffer, "avatar");
      } catch (error) {
        sendError("somthing went wrong while uploading the image", 400);
      }
    }
    const newUser = await User.create(user);
    if(!newUser){
      return sendError("failed to create user", 500);
    }
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    newUser.emailVerificationToken = token;
    await newUser.save();
    await sendMail({
      token: newUser.emailVerificationToken,
      email: newUser.email,
      name: newUser.userName,
    });
    return sendSuccess({}, "user created successfully", 200);
  } catch (error :any) {
    //check if error from mongoose validation
    if (error.name === "ValidationError") {
      const errors= Object.keys((error as any).errors).map(key=>({[key]:error.errors[key].message}))
      console.log(errors);
      return sendError("please check all fields", 400,errors);
    }
    return sendError("Internal Server Error", 500);
  }
}
