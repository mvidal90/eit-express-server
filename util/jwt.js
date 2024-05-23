import jwt from "jsonwebtoken"

export const generateJWT = id => {
    const payload = { id }

    return jwt.sign(payload, process.env.SEED_SECRET)
}