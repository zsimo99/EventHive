import { sendSuccess } from "@/utils/response";
import { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  return sendSuccess(
    { message: "Development route is active" },
    "Dev route active",
    200,
    [
      {
        name: "refreshToken",
        value: "",
        options: { httpOnly: true, maxAge: 0 },
      },
      {
        name: "accessToken",
        value: "",
        options: { httpOnly: true, maxAge: 0 },
      },
    ]
  );
}
