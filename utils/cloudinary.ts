import {v2 as cloudinary} from 'cloudinary';

export const uploadToCloudinary = async (fileBuffer:Buffer,folder:string):Promise<string> => { 
    return new Promise((res,rej)=>{
        cloudinary.uploader.upload_stream({resource_type:"auto",folder:`event_hive/${folder}`},(error,result)=>{
            if(error) return rej(error)
            res(result?.secure_url!)
        }).end(fileBuffer)
    })
}

