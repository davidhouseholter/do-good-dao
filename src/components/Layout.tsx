import { ExoticComponent, FC, Fragment, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { HomeIcon, KeyIcon, OfficeBuildingIcon, UserIcon, XIcon, MenuAlt2Icon, PlusSmIcon, UserCircleIcon, FlagIcon } from '@heroicons/react/outline'
import { HandIcon, SearchIcon } from '@heroicons/react/solid'
import { OrganizationProfile_, useAuth, } from '@/utils'
import { getProfileFull } from '@/services/ApiService'
import UserSetup from './modals/UserSetup'
import { Loading } from 'notiflix'
import { useLocation, useNavigate } from 'react-router-dom'
import UserSetupAccount from './modals/UserSetupAccount'
import { useAppState } from '@/utils/AppState'
import 'react-tiny-fab/dist/styles.css';
import { Dialog, Menu, Transition } from '@headlessui/react'
import { HelperRequestNotifictions } from '@/declarations/api/api.did'

let firstLoad = true;

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
    { name: 'Leaders', href: '/leaders', icon: UserIcon, current: false, public: true }
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

  const { hasCheckedAccountSetup, notificationShow, notificationShowSet } = useAppState();

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
  const onOpenNote = (note: HelperRequestNotifictions) => {
    // todo add type to notifications
    if (user) {
      if (user.organizations!.length > 0) {
        navigate(`/organization/${note.organizationId}`, {
          state: {
            requestId: note.requestId.toString()
          }
        });
        notificationShowSet(false);
      }
      const userRequest = user.helpRequests.find(i => i.requestId == note.requestId);
      if (userRequest) {
        navigate(`/help/`, {
          state: {
            requestId: note.requestId.toString()
          }
        });
        notificationShowSet(false);
      }
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
          {(user.organizations?.length == 0 && user.name?.length == 0) && !hasCheckedAccountSetup && (
            <>
              <UserSetupAccount setOpen={setOpen} open={open} />
            </>
          )}
        </>
      )}
      <div className="h-full flex">
        {/* Narrow sidebar */}
        <div className="hidden w-28 bg-blue-700 overflow-y-auto md:block">
          <div className="w-full py-6 flex flex-col items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className='text-blue-500' style={{fill:'rgb(59 130 246 / var(--tw-text-opacity)) !important;'}} width="50px" height="50px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><g id="Solid"><path d="M46.79248,24.23a4.05389,4.05389,0,0,0-5.689-.14l-7.69872,6.84a5.25608,5.25608,0,0,1,.58993,2.43,5.39055,5.39055,0,0,1-3.4794,5.02l-6.46895,2.43a1.00694,1.00694,0,0,1-1.27975-.59.98322.98322,0,0,1,.57986-1.28l6.46895-2.43A3.38021,3.38021,0,0,0,31.995,33.36,3.45753,3.45753,0,0,0,28.63555,30H9.99866A1.99982,1.99982,0,0,0,7.999,28H3.99966A1.99982,1.99982,0,0,0,2,30V46a1.99986,1.99986,0,0,0,1.99966,2H7.999a1.99986,1.99986,0,0,0,1.99967-2H14.048l1.24979.51A19.61328,19.61328,0,0,0,37.924,40.87l9.10846-11.01A4.20182,4.20182,0,0,0,46.79248,24.23ZM12.99816,44H9.99866V32h2.9995ZM30.41809,2a8.59142,8.59142,0,0,0-5.42194,1.9082A8.59147,8.59147,0,0,0,19.5742,2a8.68822,8.68822,0,0,0-8.66651,8.68945c0,9.14258,13.03,16.85059,13.58463,17.17481a1.00289,1.00289,0,0,0,1.00765,0C26.05456,27.54,39.08461,19.832,39.08461,10.68945A8.68822,8.68822,0,0,0,30.41809,2Zm-1.772,18.6571a.98319.98319,0,0,1-.65022.2229.99554.99554,0,0,1-.65047-1.7423c3.70153-3.1709,5.74025-6.17188,5.74025-8.44825A2.68158,2.68158,0,0,0,30.41809,8a1,1,0,0,1,0-2,4.68337,4.68337,0,0,1,4.66719,4.68945C35.08528,14.3681,31.584,18.13953,28.64605,20.6571Z" /></g></svg>
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
              {curentNavOrg && curentNavOrg.length > 0 && (<hr className="border-t border-gray-200 my-5" aria-hidden="true"></hr>)}
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
                  {/* <form className="w-full flex md:ml-0" action="#" method="GET">
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
                  </form> */}
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
                      <button className="hover:bg-blue-200 p-2 bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <FlagIcon className='h-5 w-5' onClick={() => notificationShowSet(true)} />
                      </button>
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative flex-shrink-0">
                        <div>
                          <Menu.Button<"button"> className="hover:bg-blue-200 p-2 bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Open user menu</span>
                            <span className='mr-5'>{user && (<p className='flex'><UserCircleIcon className='h-5 w-5 mt-1.5 mr-2' /> <span className='mt-1'>{user?.userName}</span></p>)}</span>

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
            <Transition.Root<ExoticComponent> show={notificationShow} as={Fragment}>
              <Dialog<"div"> as="div" className="relative z-10" onClose={notificationShowSet}>
                <div className="fixed inset-0" />

                <div className="fixed inset-0 overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                      <Transition.Child<ExoticComponent>
                        as={Fragment}
                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                      >
                        <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                            <div className="bg-blue-700 py-6 px-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <Dialog.Title className="text-lg font-medium text-white"> Notifications </Dialog.Title>
                                <div className="ml-3 flex h-7 items-center">
                                  <button
                                    type="button"
                                    className="rounded-md bg-blue-700 text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                    onClick={() => notificationShowSet(false)}
                                  >
                                    <span className="sr-only">Close panel</span>
                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                              {/* <div className="mt-1">
                                <p className="text-sm text-blue-300">
                                  Lorem, ipsum dolor sit amet consectetur adipisicing elit aliquam ad hic recusandae soluta.
                                </p>
                              </div> */}
                            </div>
                            <div className="relative flex-1 py-6 px-4 sm:px-6">
                              {/* Replace with your content */}
                              <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications</h3>
                              <div className="mt-5">

                                {user?.helpRequestsNotifications.map(note => (
                                  <div key={note.createdAt.toString()} className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                                    <div className="sm:flex sm:items-start">

                                      <div className="mt-3 sm:mt-0 sm:ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                          {note.message}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                                          
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          onOpenNote(note)
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                      >
                                        Open
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* /End replace */}
                            </div>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </div>
        </div>
      </div>
    </>
  )
}
