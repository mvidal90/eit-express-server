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