"use client"
import TextControl from "@/components/TextControl";
import { useState } from "react";

function page() {
    const [userInfo, setUserInfo] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const registerUser=async()=>{
        if(userInfo.password !== userInfo.confirmPassword){
            alert("passwords do not match");
            return;
        }
        if(!userInfo.userName || !userInfo.email || !userInfo.password){
            alert("please fill all the fields");
            return;
        }
        const formdata=new FormData();
        formdata.append("userName", userInfo.userName);
        formdata.append("email", userInfo.email);
        formdata.append("password", userInfo.password);
        const res=await fetch("/api/user/register",{
            method:"POST",
            body: formdata
        });
        const data=await res.json();
        console.log(data);
    }
  return (
    <div className="h-screen pt-20 bg-linear-to-br from-gray-950 to-gray-800 flex justify-center text-gray-100 items-center px-4">
      <div className="border border-gray-700 rounded-lg p-8 w-full max-w-md shadow-white/5 shadow-md bg-gray-900 ">
        <h1 className="text-2xl font-semibold text-center mb-8">Register</h1>
        <div className="flex flex-col gap-4">
        <TextControl label="Username" type="text" value={userInfo.userName} setValue={(value) => setUserInfo({...userInfo, userName: value})} />
        <TextControl label="Email" type="email" value={userInfo.email} setValue={(value) => setUserInfo({...userInfo, email: value})} />
        <TextControl label="Password" type="password" value={userInfo.password} setValue={(value) => setUserInfo({...userInfo, password: value})} />
        <TextControl label="Confirm Password" type="password" value={userInfo.confirmPassword} setValue={(value) => setUserInfo({...userInfo, confirmPassword: value})} />
        </div>
        <button onClick={registerUser} className="mt-8 cursor-pointer bg-purple-700 hover:bg-purple-800 duration-200 transition-colors px-8 py-2 text-lg rounded-2xl">Submit</button>
      </div>
    </div>
  );
}

export default page;
