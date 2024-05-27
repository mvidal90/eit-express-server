import * as bcrypt from 'bcrypt';

import { User } from "../models/User.js";
import { generateJWT } from "../../util/jwt.js";

export const createUser = async (req, res) => {
    const {body} = req;
    try {
        const hashPassword = await bcrypt.hash(body.password, 10)

        const user = await User.create({
            ...body,
            password: hashPassword
        })

        const jwt = generateJWT(user._id)

        res.json({
            ok: true,
            user,
            jwt,
            msg: "Usuario creado correctamente."
        })
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({
                ok: false,
                msg: "Ha habido un error en el servidor."
            })
    }
}

export const listUsers = async (req, res) => {

    const { page } = req.query;
    const docsPerPage = 10;
    const skip = (parseInt(page) - 1) * docsPerPage

    try {
        const users = await User.find({ deletedAt: { $in: [null, undefined] }}) // Decimos busca los usuarios cuya fecha de eliminaciòn sea null O undefined
            .select("-password -__v -createdAt")
            .skip(skip)
            .limit(docsPerPage)
            // .sort({userName: -1}) atributo segun queremos ordenar (1: asc | -1: desc)

        res.json({
            ok: true,
            users
        })
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({
                ok: false,
                msg: "Ha habido un error en el servidor."
            })
    }
}

export const editUser = async (req, res) => {

    const { id } = req.params

    try {
        const foundUser = await User.findOne({
            _id: id,
            deletedAt: { $in: [null, undefined]}
        })

        if (!foundUser) {
            return res.status(404)
                .json({
                    ok: false,
                    msg: "No se ha encontrado el usuario a editar"
                })
        }

        const newUser = await User.findByIdAndUpdate(id, req.body, { new: true })
        // const newUser = await User.findOneAndUpdate({email: "unemail@gmail.com"}, req.body, { new: true })

        res.json({
            ok: true,
            user: newUser,
            msg: "El usuario se editò correctamente"
        })

    } catch (error) {
        console.log(error)
        res.status(500)
            .json({
                ok: false,
                msg: "Ha habido un error en el servidor."
            })
    }
}

export const deleteUser = async (req, res) => {
    
    const { id } = req.params

    try {
        const foundUser = await User.findOne({
            _id: id,
            deletedAt: { $in: [null, undefined]}
        })

        if (!foundUser) {
            return res.status(404)
                .json({
                    ok: false,
                    msg: "No se ha encontrado el usuario a eliminar"
                })
        }

        // await User.findByIdAndDelete(id); Elimina Permanentemente el dato (NO SE RECUPERA MÀS!!)
        await User.findByIdAndUpdate(id, {deletedAt: new Date()}, { new: true })

        res.json({
            ok: true,
            msg: "El usuario se elimino correctamente"
        })

    } catch (error) {
        console.log(error)
        res.status(500)
            .json({
                ok: false,
                msg: "Ha habido un error en el servidor."
            })
    }
}

export const login = async (req, res) => {
    const {userName, password: pass} = req.body;
    try {

        const foundUser = await User.findOne({
            userName,
            deletedAt: { $in: [null, undefined]}
        })

        if (!foundUser) {
            res.status(404)
            .json({
                msg: "Usuario no encontrado."
            })
        }

        const validatePassword = bcrypt.compareSync(pass, foundUser._doc?.password)

        if (!validatePassword) {
            res.status(403)
            .json({
                msg: "La contraseña es incorrecta."
            })
        }

        const {password, ...restUser} = foundUser._doc;

        const jwt = generateJWT(restUser._id)

        res.json({
            ok: true,
            user: restUser,
            jwt,
            msg: "El usuario se loageado correctamente"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({
                ok: false,
                msg: "Ha habido un error en el servidor."
            })
    }
}

export const revalidateSession = (req, res) => {
    const jwt = generateJWT(req.id)
    res.json({
        ok: true,
        user: req.user,
        jwt,
        msg: "El usuario se loageado correctamente"
    })
}