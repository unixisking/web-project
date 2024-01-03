import prisma from "~/db/db.server"
import crypto from 'crypto'
import invariant from "invariant"

export async function createUser(username: string, password: string) {
    //Validate && hash the password && store in DB
    invariant(typeof username === "string", "username must be a string");
    invariant(username.length > 0, "username must not be empty");

    invariant(typeof password === "string", "username must be a string");
    invariant(password.length > 0, "username must not be empty");

    const isUser = await prisma.user.findUnique({ where: { username } })
    if (isUser) return null

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
    return await prisma.user.create({
        data: {
            username,
            passwordHash
        }
    })
}

export async function fetchUsers() {
    return await prisma.user.findMany({ where: { role: 'USER' }, select: { id: true, username: true, languageId: true, role: true } })
}

export async function deleteUserByUsername(username: string) {
    return await prisma.user.delete({ where: { username }, select: { id: true, username: true } })
}