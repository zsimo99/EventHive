import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import { uploadToCloudinary } from "@/utils/cloudinary";
import User from "@/models/User.model";

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

    return sendSuccess({}, "user created successfully", 200);
  } catch (error) {
    console.error("Error in user route:", error);
    return sendError("Internal Server Error", 500);
  }
}
