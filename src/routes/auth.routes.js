import express from "express";
import { createUser, deleteUser, editUser, listUsers } from "../controller/userController.js";
import { body, param } from "express-validator";
import { validationErrorResponse } from "../middlewares/validations.js";

const route = express.Router()

route
    .post("/create", 
    [
        body("userName").isString().isLength({ min: 1}).withMessage("El nombre de usuario es requerido"),
        body("email").isEmail().withMessage("El email es incorrecto"),
        body("password")
            .isString().withMessage("La password es requerida.")
            .bail()
            .isLength({ min: 8}).withMessage("La password debe tener al menos 8 caracteres."),
        validationErrorResponse
    ],
    createUser)
    .get("/list-users", listUsers)
    .put("/edit-user/:id", 
    [
        param("id")
            // .isLength({min: 24, max: 24})
            .isMongoId()
            .withMessage("El id no tiene el forma to adecuado."),
        validationErrorResponse
    ]
    ,editUser)
    .delete("/delete-user/:id", deleteUser)

export default route;