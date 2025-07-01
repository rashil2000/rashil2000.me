import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "../../../lib/dbUtils";
import User from "../../../models/User";

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

export default NextAuth(authOptions);