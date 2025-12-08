import { verifyRefreshToken } from "@/lib/auth";
import User from "@/models/User.model";
import { sendError, sendSuccess } from "@/utils/response";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const refreshToken = req.cookies.get("refreshToken")?.value;
        if (!refreshToken) {
            return sendError("No refresh token provided", 401);
        }
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return sendError("Invalid refresh token", 401);
        }
        const user = await User.findById((decoded as any)._id).select("+refreshToken");
        if (!user || user.refreshToken !== refreshToken) {
            return sendError("Invalid refresh token", 401);
        }
        const { accessToken , refreshToken: newRefreshToken } = user.generateTokens();
        user.refreshToken = newRefreshToken;
        await user.save();
        return sendSuccess({}, "Tokens refreshed successfully", 200, [
            {
                name: "refreshToken", value: newRefreshToken, options: {httpOnly: true, path: "/api/user/refresh-token", maxAge: 7 * 24 * 60 * 60,}
            },
            {
                name: "accessToken", value: accessToken, options: {httpOnly: true, path: "/", maxAge: 15 * 60,}
            },
        ]);
    } catch (error) {
        return sendError("Internal server error", 500);
    }
}