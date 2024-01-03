import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";
import { createUser } from "~/db/user.server";

const notify = (message: string) => toast(message);

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData()
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const user = await createUser(username, password)
    if (!user) return json({ error: true, status: 401, message: "User already exists" }, { status: 401 })
    return json({ error: false, status: 201, message: "User created successfully, please login" }, { status: 201 })
}

export default function RegisterPage() {
    const response = useActionData<{ error: boolean, message: string, status: number }>()
    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign up for an account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Form className="space-y-6" action="/register" method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
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
                    </Form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Are you a member?{' '}
                        <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Please login
                        </Link>
                    </p>
                </div>
                {response?.message && <Toast message={response.message} />}
            </div>
        </>
    )
}

function Toast({ message }: { message: string }) {
    useEffect(() => {
        notify(message)
    }, [message])
    return <Toaster />

}