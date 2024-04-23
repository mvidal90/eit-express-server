
import express from "express";
import { getEndpointController } from "../controller/firstEndpointController.js";

const route = express.Router()


// 3 parametros: continuación de la url / MIDLEWARE / CONTROLADOR (función)
route
    .get("/", getEndpointController)
    .get("/byId/:id", () => {});

export default route