import express from "express";
import { createUser, deleteUser, editUser, listUsers } from "../controller/userController.js";

const route = express.Router()

route
    .post("/create", createUser)
    .get("/list-users", listUsers)
    .put("/edit-user/:id", editUser)
    .delete("/delete-user/:id", deleteUser)

export default route;