import { verifyAccessToken } from "@/lib/auth";
import Event from "@/models/Event.model";
import User from "@/models/User.model";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      return sendError("Unauthorized", 401);
    }

    const formfData = await req.formData();
    const title = formfData.get("title") as string;
    const description = formfData.get("description") as string;
    const date = new Date(formfData.get("date") as string);
    const location = formfData.get("location") as string;
    const price = parseFloat(formfData.get("price") as string);
    // const category = formfData.get("category") as "concerts" | "workshops" | "conferences";
    // const capacity = parseInt(formfData.get("capacity") as string);
    const tags =
      formfData
        .get("tags")
        ?.toString()
        .replace(/[\[\]']+/g, "")
        .split(",")
        .map((tag) => tag.trim()) || [];
    const image = formfData.get("image") as File;
    //convert
    const categories = ["concerts", "workshops", "conferences"];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const capacity = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
    // pm.variables.set("capacity", capacity);

    if (
      !title ||
      !date ||
      !location ||
      !category ||
      isNaN(price) ||
      isNaN(capacity) ||
      tags.length === 0 ||
      !description ||
      !image
    ) {
      return sendError("Please provide all required fields", 400);
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    //upload image to cloudinary
    let imageUrl: string;
    try {
      imageUrl = await uploadToCloudinary(buffer, "events");
    } catch (error) {
      return sendError("somthing went wrong while uploading the image", 400);
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return sendError("token invalid", 401);
    }
    const user = await User.findById(payload._id);
    if (!user) {
      return sendError("User not found", 404);
    }
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      category,
      price,
      capacity,
      tags,
      image: imageUrl,
      organizer: user._id,
    });
    return sendSuccess({ event: newEvent }, "Event created successfully", 201);
  } catch (error: any) {
    //check if error is instance of mongoose error
    if (error.name == "ValidationError") {
      const errors = Object.keys((error as any).errors).map((key) => ({
        [key]: (error as any).errors[key].message,
      }));
      return sendError("Please check all fields", 400, errors);
    }
    return sendError("Internal Server Error", 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const page = parseInt(params.get("page") || "1") < 1 ? 1 : parseInt(params.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;
    const category = params.get("category");
    const search = params.get("search")?.toLowerCase() || "";
    await connectDB();
    let match: any = [];
    if (search) {
      match.push({ title: { $regex: search,$options: "i" } });
      match.push({ description: { $regex: search,$options: "i" } });
      match.push({ tags: { $regex: search,$options: "i" } });
    }
    const events = await Event.aggregate([
      {
        $match: {
          category: category ? category : { $exists: true },
        },
      },
      {
        $match: match.length > 0 ? { $or: match } : {},
      },
      {
        $lookup: {
          from: "users",
          localField: "organizer",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip }, // pagination: skip
            { $limit: limit }, // pagination: limit
          ],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $addFields: {
          totalCount: {
            $arrayElemAt: ["$totalCount.count", 0],
          },
        },
      },
    ]);
    return sendSuccess(
      { events: events[0].data, totalCount: events[0].totalCount || 0 },
      "Events fetched successfully"
    );
  } catch (error) {
    console.log(error);
    return sendError("Internal Server Error", 500);
  }
}
