import jwt from 'jsonwebtoken';

export const verifyAccessToken = (token:string) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {_id:string};
        return decoded;
    } catch (error) {
        return null;
    }
}
export const verifyRefreshToken = (token:string) => {
    try {
        const decoded= jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {_id:string};
        return decoded;
    } catch (error) {
        return null;
    }
}