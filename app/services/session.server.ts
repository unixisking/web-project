import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage(
    {
        cookie: {
            name: "_session", // use any name you want here
            sameSite: "lax", // this helps with CSRF
            path: "/", // the cookie will work in all routes
            // Security reasons, prevent Document.cookie in the client, make this cookie http only to mitigate cross-site scripting XSS attacks.
            httpOnly: true,
            secrets: [process.env.AUTH_SECRET || ''], // replace this with an actual secret
            // secure: process.env.NODE_ENV === "production", // enable this in prod only
            secure: false
        }
    }
)

export const { getSession, commitSession, destroySession } = sessionStorage