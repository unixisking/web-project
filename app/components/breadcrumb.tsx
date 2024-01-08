
import { Link, useMatches } from '@remix-run/react'
import { useMemo } from 'react'

type BreadCrumbRoute = {
    name: string,
    to: string
}

export default function BreadCrumb() {
    const matches = useMatches()
    const routes = useMemo(() =>
        matches
            .map(match => getRouteBasedonMatch(match.pathname))
            .filter((r): r is BreadCrumbRoute => r !== null)
        , [matches])
    return (
        <nav className="w-full rounded-md mb-8">
            <ol className="list-reset flex">
                {routes.map((route, i) =>
                (
                    <div key={route.name} className='flex'>

                        <li>
                            <Link
                                to={route.to}
                                className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600 capitalize"
                            >{route.name}</Link>
                        </li>
                        {routes[i + 1] && (
                            <li>
                                <span className="mx-2 text-neutral-500 dark:text-neutral-400">/</span>
                            </li>
                        )}
                    </div>
                )
                )}
            </ol>
        </nav>
    )
}

const getRouteBasedonMatch = (pathname: string): BreadCrumbRoute | null => {

    if (pathname === '/') return null
    if (pathname === '/dashboard') return { name: 'Home', to: '/dashboard' }

    return {
        name: pathname.split('/').slice(-1)[0],
        to: pathname
    }
}