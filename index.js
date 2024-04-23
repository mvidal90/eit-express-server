
import express from "express"

import endpointRoute from "./src/routes/firstEndpoint.routes.js"
import authRoutes from "./src/routes/auth.routes.js"

import { dbConection } from "./src/database/dbConection.js"

const PORT = 4000

const appServer = async () => {
    await dbConection()
    
    const server = express()
    
    server.use(express.json())
    
    server.use("/api/endpoint", endpointRoute)
    server.use("/api/auth", authRoutes)
    
    server.listen(PORT, () => console.log("El servidor esta corriendo correctamente en el puerto ", PORT))
}

appServer()