import clsx from 'clsx'
import { Link, useLocation } from '@remix-run/react'
import { links } from '../utils/constants'

export default function NavLinks({ isAdmin }: { isAdmin: boolean }) {
    const { pathname } = useLocation()
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon
                return link.admin === true ? isAdmin ? (
                    <Link
                        key={link.name}
                        to={link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                                'bg-green-100 text-green-600': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>

                ) : null : (

                    <Link
                        key={link.name}
                        to={link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-green-100 hover:text-green-600 md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                                'bg-green-100 text-green-600': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                )

            })}
        </>
    )
}


