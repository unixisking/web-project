import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import invariant from 'invariant'
import type { User } from "~/utils/types";
import prisma from "../db/db.server";
import crypto from 'crypto'

export const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
    new FormStrategy(async ({ form }) => {
        const username = form.get('username')
        const password = form.get('password')

        // Server side validation
        invariant(typeof username === "string", "username must be a string");
        invariant(username.length > 0, "username must not be empty");

        invariant(typeof password === "string", "username must be a string");
        invariant(password.length > 0, "username must not be empty");

        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) throw new AuthorizationError('bad_login')

        else {
            // Compare the provided password with the stored hashed password
            const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
            const passwordMatch = passwordHash === user.passwordHash

            if (!passwordMatch) {
                throw new AuthorizationError('bad_login');
            }
            return {
                id: user.id,
                username: user.username,
                role: user.role
            }
        }
    })
)