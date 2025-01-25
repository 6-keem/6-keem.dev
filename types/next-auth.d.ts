import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        followers?: any[];
    }

    interface Session {
        user?: User;
    }
}
