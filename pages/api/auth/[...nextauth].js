import NextAuth from "next-auth";
import { authOptions } from "../../../services/AuthService";

export default NextAuth(authOptions);