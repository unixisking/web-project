import type { USER_ROLE } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import BreadCrumb from "~/components/breadcrumb";
import Dropdown from "~/components/dropdown";
import SideNav from "~/components/sidenav";
import { authenticator } from "~/services/auth.server";

type Session = {
    id: string;
    username: string;
    role: USER_ROLE
}

export function action({ request }: ActionFunctionArgs) {
    return authenticator.logout(request, { redirectTo: '/' })
}

export async function loader({ request }: LoaderFunctionArgs) {
    return await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
}
export default function DashboardPage() {
    const session = useLoaderData<Session>()
    const isAdmin = useMemo(() => session.role === 'ADMIN', [session.role])

    return <div className="flex h-screen flex-col md:flex-row">
        <div className="w-full flex-none md:w-64">
            <SideNav isAdmin={isAdmin} />
        </div>
        <div className="flex-grow p-6">
            <div className='float-right'>
                {session?.username && (<Dropdown title={session.username} />)}
            </div>
            <BreadCrumb />
            <Outlet />
        </div>
    </div>
}