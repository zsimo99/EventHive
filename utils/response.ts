import { NextResponse } from "next/server";

export const sendSuccess = (data: any, message = "OK", status = 200,cookie?: {name: string, value: string, options?: any}[] | undefined) => {
  if(!cookie){
    return NextResponse.json(
    {
      message,
      status,
      success: true,
      data,
    },
    { status }
  );
  }else{
    const response = NextResponse.json(
      {
        message,
        status,
        success: true,
        data,
      },
      { status }
    );
    if(cookie.length > 0){
      cookie.forEach((c) => {
        response.cookies.set(c.name, c.value, c.options);
      });
    }
    return response;
  }
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
