import jwt from "jsonwebtoken"
import { User } from "../models/User.js";


export const validateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    try {
        const {id} = jwt.verify(
            token,
            process.env.SEED_SECRET
        );

        const findUser = await User.find({
            _id: id,
            deletedAt: { $in: [null, undefined]}
        })

        if (!findUser) {
            return res.status(404).json({
                msg: "usuario no encontrado.",
            })
        }
        req.id = id;
        next()
    } catch (error) {
        return res.status(401).json({
            msg: "No tiene autorización.",
            error
        })
    }
}