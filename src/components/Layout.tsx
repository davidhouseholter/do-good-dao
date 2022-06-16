import { ExoticComponent, FC, Fragment, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { HomeIcon, KeyIcon, MenuAlt1Icon, OfficeBuildingIcon, SelectorIcon, UserIcon, XIcon, PlusIcon, MenuAlt2Icon, PlusSmIcon } from '@heroicons/react/outline'
import { HandIcon, SearchIcon, SupportIcon } from '@heroicons/react/solid'
import { OrganizationProfile_, useAuth, } from '@/utils'

import { getProfileFull, getUserNameByPrincipal, getWhoAMI } from '@/services/ApiService'
import UserSetup from './modals/UserSetup'
import { Loading } from 'notiflix'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import UserSetupAccount from './modals/UserSetupAccount'
import { useAppState } from '@/utils/AppState'
import { OrganizationProfile } from '@/declarations/api/api.did'
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  CogIcon,
  CollectionIcon,
  PhotographIcon,
  UserGroupIcon,
  ViewGridIcon,
} from '@heroicons/react/outline';
// const sidebarNavigation = [
//   { name: 'Home', href: '#', icon: HomeIcon, current: false },
//   { name: 'All Files', href: '#', icon: ViewGridIcon, current: false },
//   { name: 'Photos', href: '#', icon: PhotographIcon, current: true },
//   { name: 'Shared', href: '#', icon: UserGroupIcon, current: false },
//   { name: 'Albums', href: '#', icon: CollectionIcon, current: false },
//   { name: 'Settings', href: '#', icon: CogIcon, current: false },
// ]



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
interface Props {
  head?: any
  title: string
}
export const Layout: FC<Props> = ({ head, children, title }) => {
  const userNavigation = [
    {
      name: 'Settings', onClick: () => {
        navigate("/settings")
      }
    },
    {
      name: 'Sign out', onClick: () => {
        onLogout()
      }
    },
  ]
  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon, current: false, public: true },
    { name: 'Users', href: '/users', icon: UserIcon, current: false, public: true }
  ]
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const { setHasCheckedICUser, setHasCheckedStarted, logIn, logOut, isAuthenticated, user, hasCheckedICUser, setUser } = useAuth();
  let nav = [...navigation];
  useEffect(() => {
    if (hasCheckedICUser) {
      if (!isAuthenticated) {
        setCurrentNav(curentNav.filter(i => i.public).map(i => { return { ...i, current: i.href == location.pathname } }));
        setCurrentOrg([]);
      }
      else {

        let nav = [...navigation, { name: 'Help', href: '/help', icon: HandIcon, current: false, public: false },
        { name: 'Request', href: '/request', icon: KeyIcon, current: false, public: false }];
        setCurrentNav(nav.map(i => { return { ...i, current: i.href == location.pathname } }));
        if (!user) return;
        setCurrentOrg(user.organizations?.map(i => { return { ...i, current: `/organization/${i.organziationId}` == location.pathname } }));
      }
    }


  }, [user, isAuthenticated])

  const [curentNav, setCurrentNav] = useState(nav);
  const [curentNavOrg, setCurrentOrg] = useState<OrganizationProfile_[]>([]);

  const { hasCheckedAccountSetup } = useAppState();

  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const onLogout = async () => {
    setHasCheckedICUser(false)
    setHasCheckedStarted(false)
    logOut();
    setCurrentNav([])
    navigate("/")
  }
  const onClose = async (val, newUser) => {
    setOpen(val);
    if (newUser) {

      Loading.standard();
      const u = await getProfileFull();
      setUser(u as any);
      setOpen(true);
      Loading.remove();
    }
  }
  // const getMe = async () => {
  //   const me = await getWhoAMI();
  //   console.log(me.toText())
  // }
  return (
    <>
      <Helmet>
        <title>{title} | Do Good </title>
        <meta name="description" content="A example web app on the Internet Computer." />
        {head}
      </Helmet>
      {isAuthenticated && !user && (
        <>
          {hasCheckedICUser && (
            <>
              <UserSetup setOpen={onClose} open={open} />
            </>
          )}
        </>
      )}
      {isAuthenticated && user && (
        <>
          {user.organizations?.length == 0 && !hasCheckedAccountSetup &&(
            <>
              <UserSetupAccount setOpen={setOpen} open={open} />
            </>
          )}
        </>
      )}
      <div className="h-full flex">
        {/* Narrow sidebar */}
        <div className="hidden w-28 bg-indigo-700 overflow-y-auto md:block">
          <div className="w-full py-6 flex flex-col items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                alt="Workflow"
              />
            </div>
            <div className="flex-1 mt-6 w-full px-2 space-y-1">
              {curentNav.map((item) => (
                <a
                  key={item.name}
                  onClick={() => {
                    item.current = true;
                    navigate(item.href)
                  }}
                  className={classNames(
                    item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.current ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                      'h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  <span className="mt-2">{item.name}</span>
                </a>
              ))}
              <hr className="border-t border-gray-200 my-5" aria-hidden="true"></hr>
              {curentNavOrg?.map((item) => (
                <a
                  key={item.name}
                  onClick={() => {
                    item.current = true;
                    navigate(`/organization/${item.organziationId}`)
                  }}
                  className={classNames(
                    item.current ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                    'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <OfficeBuildingIcon className={classNames(
                    item.current ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                    'h-6 w-6'
                  )} />
                  <span className="mt-2 text-center">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition.Root<ExoticComponent> show={mobileMenuOpen} as={Fragment}>
          <Dialog<"div"> as="div" className="relative z-20 md:hidden" onClose={setMobileMenuOpen}>
            <Transition.Child<ExoticComponent>
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child<ExoticComponent>
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative max-w-xs w-full bg-indigo-700 pt-5 pb-4 flex-1 flex flex-col">
                  <Transition.Child<ExoticComponent>
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-1 right-0 -mr-14 p-1">
                      <button
                        type="button"
                        className="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        <span className="sr-only">Close sidebar</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-shrink-0 px-4 flex items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                      alt="Workflow"
                    />
                  </div>
                  <div className="mt-5 flex-1 h-0 px-2 overflow-y-auto">
                    <nav className="h-full flex flex-col">
                      <div className="space-y-1">
                        {curentNav.map((item) => (
                          <a
                            key={item.name}
                            onClick={() => {
                              item.current = true;
                              navigate(item.href)
                            }}
                            className={classNames(
                              item.current
                                ? 'bg-indigo-800 text-white'
                                : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                              'group py-2 px-3 rounded-md flex items-center text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            <item.icon
                              className={classNames(
                                item.current ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                                'mr-3 h-6 w-6'
                              )}
                              aria-hidden="true"
                            />
                            <span>{item.name}</span>
                          </a>
                        ))}
                      </div>
                      <hr className="border-t border-gray-200 my-5" aria-hidden="true"></hr>
                      <div className="space-y-1">
                        {curentNavOrg?.map((item) => (
                          <a
                            key={item.name}
                            onClick={() => {
                              item.current = true;
                              navigate(`/organization/${item.organziationId}`)
                            }}
                            className={classNames(
                              item.current
                                ? 'bg-indigo-800 text-white'
                                : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                              'group py-2 px-3 rounded-md flex items-center text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            <OfficeBuildingIcon />
                            <span>{item.name}</span>
                          </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
              <button
                type="button"
                className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-1 flex justify-between px-4 sm:px-6">
                <div className="flex-1 flex">
                  <form className="w-full flex md:ml-0" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                      Search all files
                    </label>
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                        <SearchIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                      </div>
                      <input
                        name="search-field"
                        id="search-field"
                        className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400"
                        placeholder="Search"
                        type="search"
                      />
                    </div>
                  </form>
                </div>
                <div className="ml-2 flex items-center space-x-4 sm:ml-6 sm:space-x-6">
                  {!user && !isAuthenticated && (
                    <button onClick={async () => {
                      await logIn();
                    }} id="sign-in" className="px-8 py-2 rounded-full text-lg focus:outline-none font-medium text-white bg-gradient-to-r from-indigo-600 to-pink-500">
                      Login
                    </button>
                  )}
                  {isAuthenticated && (
                    <>
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative flex-shrink-0">
                        <div>
                          <Menu.Button<"button"> className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                              alt=""
                            />
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
                          <Menu.Items<"div"> className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item<"div"> key={item.name}>
                                {({ active }) => (
                                  <a
                                    onClick={() => {
                                      item.onClick();
                                    }}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      {user && (
                        <>

                          <Menu as="div" className="relative flex-shrink-0">
                            <div>
                              <Menu.Button<"button"> className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <PlusSmIcon className="h-6 w-6" aria-hidden="true" />
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
                              <Menu.Items<"div"> className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <Menu.Item<"div"> >
                                  <a
                                    onClick={() => { navigate(`/request?add=true`) }}
                                    className='block px-4 py-2 text-sm text-gray-700'
                                  >
                                    <span className='flex'> <KeyIcon className="h-12 w-12" /><span className='ml-2'>Add Request</span></span>

                                  </a>
                                </Menu.Item>
                                <Menu.Item<"div"> >
                                  <a
                                    onClick={() => { }}
                                    className='block px-4 py-2 text-sm text-gray-700'
                                  >
                                    <span className='flex'>
                                      <HandIcon className="h-12 w-12" /><span className='ml-2'>Add Helper</span>
                                    </span>
                                  </a>
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </Menu>

                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              {/* Primary column */}
              <section aria-labelledby="primary-heading" className="min-w-0 flex-1 h-full flex flex-col lg:order-last">
                {children}
              </section>
            </main>

            {/* Secondary column (hidden on smaller screens) */}
            <aside className="hidden w-96 bg-white border-l border-gray-200 overflow-y-auto lg:block">
              {/* Your content */}


              Notifications (appear on top dropdown for smaller screens)
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
