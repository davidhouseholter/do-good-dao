import { ExoticComponent, FC, Fragment, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { HomeIcon, MenuAlt1Icon, SelectorIcon, UserIcon, XIcon } from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'
import { useAuth, } from '@/utils'

import { getProfileFull, getUserNameByPrincipal, getWhoAMI } from '@/services/ApiService'
import UserSetup from './modals/UserSetup'
import { Transition, Dialog, Menu } from '@headlessui/react'
import { Loading } from 'notiflix'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: false },
  { name: 'Users', href: '/users', icon: UserIcon, current: false },

]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
interface Props {
  head?: any
  title: string
}
export const Layout: FC<Props> = ({ head, children, title }) => {
  const location = useLocation()
  navigation.map(i => i.current = i.href == location.pathname)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
 const {setHasCheckedICUser,setHasCheckedStarted, logIn, logOut, isAuthenticated, user, hasCheckedICUser} = useAuth()
  const onLogout = async () => {
    setHasCheckedICUser(false)
    setHasCheckedStarted(false)
    logOut();
    navigate("/")
  }
  // const getMe = async () => {
  //   const me = await getWhoAMI();
  //   console.log(me.toText())
  // }
  return (
    <>
      <Helmet>
        <title>{title} | IC Example Web App </title>
        <meta name="description" content="A example web app on the Internet Computer." />
        {head}
      </Helmet>
      <div className="min-h-full">
        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:pt-5 lg:pb-4 lg:bg-gray-100">
          <div className="flex items-center flex-shrink-0 px-6">
            IC Example Web App
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="mt-6 h-0 flex-1 flex flex-col overflow-y-auto">
            {/* User account dropdown */}
            {!isAuthenticated && (
              <>
                <p>
                  <button onClick={async () => {
                    await logIn();
                  }} id="sign-in" className="px-8 py-2 rounded-full text-lg focus:outline-none font-medium text-white bg-gradient-to-r from-indigo-600 to-pink-500">
                    Login
                  </button>
                </p>
                {/* <p>
                  <button onClick={async () => {
                    await getMe();
                  }} id="sign-in" className="px-8 py-2 rounded-full text-lg focus:outline-none font-medium text-white bg-gradient-to-r from-indigo-600 to-pink-500">
                    Who Am I
                  </button>
                </p> */}
              </>
            )}
            {isAuthenticated && !user && (
              <>
                {hasCheckedICUser && (
                  <>
                    <UserSetup setOpen={setOpen} open={open} />
                  </>
                )}
              </>
            )}
            {isAuthenticated && hasCheckedICUser && (
              <>
             
                <Menu as="div" className=" mt-3 px-3 relative inline-block text-left">
                  <div>
                    <Menu.Button<"button"> className="group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500">
                      <span className="flex w-full justify-between items-center">
                        <span className="flex min-w-0 items-center justify-between space-x-3">
                          {/* <img
                            className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                            src=""
                            alt=""
                          /> */}
                          <span className="flex-1 flex flex-col min-w-0">
                            {user?.name && (<span className="text-gray-900 text-sm font-medium truncate">{user?.name}</span>)}
                            <span className="text-gray-500 text-sm truncate">{user ? `@${user?.userName}` : 'Choose Username to Continue'}</span>
                          </span>
                        </span>
                        <SelectorIcon
                          className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition<ExoticComponent>
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items<ExoticComponent> className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item<ExoticComponent>>
                          {({ active }) => (
                            <a
                              onClick={() => {
                                navigate("/profile")
                              }}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              View profile
                            </a>
                          )}
                        </Menu.Item>
                       {user && (
                        <>
                         <Menu.Item<ExoticComponent>>
                          {({ active }) => (
                            <a
                            onClick={() => {
                              navigate("/settings")
                            }}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                     
                        </>
                       )}
                      </div>

                      <div className="py-1">
                        <Menu.Item<ExoticComponent>>
                          {({ active }) => (
                            <a onClick={() => { onLogout() }}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )} >
                              Logout
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>
            )}

            {/* Sidebar Search */}
            <div className="px-3 mt-5">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  aria-hidden="true"
                >
                  <SearchIcon className="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search"
                />
              </div>
            </div>
            {/* Navigation */}
            <nav className="px-3 mt-6">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    onClick={() => {
                      navigate(item.href)
                    }}
                    className={classNames(
                      item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </div>

            </nav>
          </div>
        </div>
        {/* Main column */}
        <div className="lg:pl-64 flex flex-col">
          {/* Search header */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 lg:hidden">
            <button
              type="button"
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            // onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex-1 flex">
                <form className="w-full flex md:ml-0" action="#" method="GET">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <input
                      id="search-field"
                      name="search-field"
                      className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:text-sm"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </form>
              </div>
              <div className="flex items-center">
                {/* Profile dropdown */}

              </div>
            </div>
          </div>
          <main className="flex-1">
          <div className="w-full py-6 flex items-center justify-between bg-gray-100 ">
                <div className=""></div>
                <div className="ml-10 space-x-4">
               
                </div>
              </div>
            {children}
          </main>

        </div>
      </div>
    </>
  )
}
