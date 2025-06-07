import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";

import dbConnect from "../lib/dbConnect";
import User from "../models/User";

export const validate = async password => {
    try {
        const result = await signIn('credentials', {
            redirect: false,
            username: "rashil2000",
            password
        });

        if (result.ok) {
            history.back();
        } else {
            alert('Incorrect passphrase.');
        }
    } catch (err) {
        return alert('Error:\n' + JSON.stringify(err));
    }
}

export const authOptions = {
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();
                const user = await User.findOne({
                    username: credentials?.username,
                }).select("+password");

                if (!user) throw new Error("Wrong username");

                const passwordMatch = await bcrypt.compare(
                    credentials?.password,
                    user.password
                );

                if (!passwordMatch) throw new Error("Wrong Password");
                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
};

export const register = async (values) => {
    const { username, password, firstname, lastname } = values;
    await dbConnect();
    try {
        const userFound = await User.findOne({ username });
        if (userFound) {
            alert('Error:\nUsername already exists!');
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstname,
            lastname,
            username,
            password: hashedPassword,
        });
        const newUser = await user.save();
        console.log('New user: ' + newUser);
    } catch(e) {
        alert('Error:\n' + JSON.stringify(e));
    }
}
