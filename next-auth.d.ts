import {JWT} from "@auth/core/jwt";
import {DefaultSession} from "next-auth";
import {User} from "@/model/user";

export type ExtendedUser = DefaultSession['user'] & User;

declare module  "next-auth" {
  interface Session {
    user: ExtendedUser
  }
  interface JWT {
    something:string
  }
}