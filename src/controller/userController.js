import { User } from "../models/User.js";
import * as bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    const {body} = req;
    try {
        const hashPassword = await bcrypt.hash(body.password, 10)

        const user = await User.create({
            ...body,
            password: hashPassword
        })

        res.json({
            ok: true,
            user,
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
    const docsPerPage = 3;
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