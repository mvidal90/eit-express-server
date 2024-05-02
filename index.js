
import express from "express"
import cors from "cors"

import endpointRoute from "./src/routes/firstEndpoint.routes.js"
import authRoutes from "./src/routes/auth.routes.js"

import { dbConection } from "./src/database/dbConection.js"
import dotenv from "dotenv"

const appServer = async () => {
    dotenv.config()
    await dbConection()

    const server = express()
    
    server.use(express.json())

    server.use(cors())
    
    server.use("/api/endpoint", endpointRoute)
    server.use("/api/auth", authRoutes)
    
    server.listen(process.env.PORT, () => console.log("El servidor esta corriendo correctamente en el puerto ", process.env.PORT))
}

appServer()