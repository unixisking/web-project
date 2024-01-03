import { USER_ROLE } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useLoaderData, useSubmit } from "@remix-run/react"
import { useState } from "react";
import { Button } from "~/components/button"
import Modal from "~/components/modal";
import { deleteUserByUsername, fetchUsers } from "~/db/user.server"
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const currentUser = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    console.log('currentUser', currentUser)
    if (currentUser.role !== USER_ROLE.ADMIN) return redirect('/dashboard')
    return await fetchUsers()
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const username = formData.get('username') as string
    return deleteUserByUsername(username)

}
export default function DashboardUsers() {
    const users = useLoaderData<typeof loader>()
    const submit = useSubmit()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState('')
    return (
        <div>
            <Modal
                cb={() => submit({ 'username': userToDelete }, { method: 'post' })}
                isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

            <table className="min-w-full text-gray-900 md:table">
                <thead className="rounded-lg text-left text-sm font-normal">
                    <tr>
                        <th scope="col" className="px-2 py-5 font-medium">
                            ID
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Username
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Role
                        </th>
                        <th scope="col" className="px-3 py-5 font-medium">
                            Default language
                        </th>
                        <th scope="col" className="relative py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {users?.map((user) => (
                        <tr
                            key={user.username}
                            className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >
                            <td className="whitespace-nowrap px-3 py-3">
                                {user.id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {user.username}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {user.role}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3">
                                {user.languageId}
                            </td>
                            <td className="whitespace-nowrap py-3">
                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => {
                                            setUserToDelete(user.username)
                                            setIsModalOpen(true)
                                        }
                                        }
                                        className="bg-red-500 hover:bg-red-400 focus-visible:outline-red-500 active:bg-red-600">Delete</Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}