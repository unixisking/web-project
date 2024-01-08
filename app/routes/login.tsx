import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "~/services/auth.server";

import type { LoginError } from "~/utils/types";


export async function action({ request }: ActionFunctionArgs) {
    let formData = await request.formData();
    try {
        return await authenticator.authenticate("form", request, {
            successRedirect: '/dashboard',
            throwOnError: true,
            context: { formData }
        })
    } catch (error) {
        if (error instanceof Response) return error;
        if (error instanceof AuthorizationError) {
            // bad auth credentials
            return json({ error: true, type: 'LoginCredentials', message: 'Your username or password is not correct.' }, { status: 401 })
        }
        return error
    }
    // error related to something else
}

export default function LoginPage() {
    const response = useActionData<LoginError>()
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                {response?.error && response?.type === 'LoginCredentials' && (
                    <p className="text-center text-sm text-red-500">{response?.message}</p>
                )}

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="/login" className="space-y-6" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Please register
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}