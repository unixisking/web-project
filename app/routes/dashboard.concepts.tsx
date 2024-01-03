import { Outlet } from "@remix-run/react";

export default function DashboardPage() {
    return <div className="h-screen">
        <Outlet />
    </div>
}