import { Link } from '@remix-run/react';
import { PowerIcon } from '@heroicons/react/24/outline';
import NavLinks from './nav-links';
import DashLogo from './dash-logo';

export default function SideNav({ isAdmin = false }: { isAdmin: boolean }) {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">

            <div
                className="mb-2 flex h-20 items-end justify-start rounded-md bg-green-600 p-4 md:h-40"
            >
                <Link
                    to=""
                >
                    <div className="w-32 text-white md:w-40">
                        <DashLogo />
                    </div>
                </Link>
            </div>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                <NavLinks isAdmin={isAdmin} />
                <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
                <form
                    method='post'
                    action="/dashboard"
                >
                    <button type='submit' className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3">
                        <PowerIcon className="w-6" />
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    );
}
