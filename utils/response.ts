import { NextResponse } from "next/server";

export const sendSuccess = (data: any, message = "OK", status = 200) => {
  return NextResponse.json(
    {
      message,
      status,
      success: true,
      data,
    },
    { status }
  );
};

export const sendError = (message = "Something went wrong", status = 500,  errors: any = null) => {
  return NextResponse.json(
    {
      message,
      status,
      success: false,
      data: null,
      errors
    },
    { status }
  );
};
