import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided",
            });
        }

        let decode;

        try {
            decode = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token",
            });
        }

        const user = await db.user.findUnique({
            where: {
                id: decode.id,
            },
            select: {
                id: true,
                image: true,
                name: true,
                role: true,
            },
        });

        if(!user){
            return res.status(404).json({
                message  : "user not found" 
            })
        }

        // Add user to request object for further use
        req.user = user;

        next();
    } catch (error) {
        console.log("Error authenicating user" , error)  
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
