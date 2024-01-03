import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react'
import clsx from 'clsx';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface DropDownProps {
    title: string
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Dropdown({ title }: DropDownProps) {
    return (
        <form method="post" action="/dashboard">
            <Menu as="div" className="relative inline-block text-left">
                {({ open }: { open: boolean }) => (
                    <>
                        <div>
                            <Menu.Button className={clsx("bg-gray-100 hover:bg-green-100 rounded-xl items-center inline-flex w-full gap-x-4 text-sm font-semibold text-gray-900 hover:text-green-600 shadow-sm py-2 px-4", { "bg-green-100 text-green-600": open })} >
                                <UserCircleIcon
                                    width={32}
                                    height={32}
                                />
                                {title}
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }: { active: boolean }) => (
                                            <button
                                                type="submit"
                                                className={classNames(
                                                    active ? 'bg-green-100 text-green-600' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                                )}
                                            >
                                                Logout
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </>
                )}
            </Menu>
        </form>
    )
}