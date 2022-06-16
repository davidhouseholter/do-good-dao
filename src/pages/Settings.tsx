import { Layout } from '@/components'
import UserSetup from '@/components/modals/UserSetup';
import OrganizationSettings from '@/components/organization/OrganizationSettings';
import SelectAccountType from '@/components/user/AccountSetup';
import ProfileEdit from '@/components/user/ProfileEdit';
import { OrganizationProfile } from '@/declarations/api/api.did';
import { getUserProfile } from '@/services/ApiService';
import { useAuth } from '@/utils'
import { Switch } from '@headlessui/react';
import { UserCircleIcon, CogIcon, KeyIcon, BellIcon, CreditCardIcon, ViewGridAddIcon, ArrowCircleLeftIcon } from '@heroicons/react/outline';
import { OfficeBuildingIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation, Location } from 'react-router-dom';

export const Settings = () => {
    const subNavigation = [
        {
            name: 'Profile', href: '/settings', icon: UserCircleIcon, current: true, page: () => <ProfileEdit user={user} />,

        },
    ];

    const { isAuthenticated, user, logOut, identity, hasCheckedICUser } = useAuth();
    const [open, setOpen] = useState(true);
    const [userLoaded, setUserLoaded] = useState(false);
    const [userProfile, setUserProfile] = useState<any>();
    const navigate = useNavigate();
    const location : Location = useLocation()
    const [currentNav, setCurrentNav] = useState<any[]>(subNavigation);
    useEffect(() => {
        const fetchData = async () => {

            const userProfile_ = await getUserProfile(user!.userName);
            setUserProfile(userProfile_);
        }
        if (hasCheckedICUser) {
            fetchData()
        }
        if(user && user.organizations?.length > 0) {
            for(const org  of user.organizations) {
                subNavigation.push( { name: org.name, href: `/settings/organization/${org.organziationId}`, icon: OfficeBuildingIcon, current: false, page: () => <OrganizationSettings user={user} org={org} /> },)
            }
        }
        subNavigation.map(i => i.current = i.href == location.pathname)
        setCurrentNav(subNavigation);
        
    }, [hasCheckedICUser, user]);

    const onSideNavClick = (item) => {
        const newNav = currentNav.map(i => { return { ...i, current: i.href == item.href ? true : false } });
        setCurrentNav([...newNav])
        navigate(item.href, { replace: false })
    }
    if (!user && hasCheckedICUser) {
        return <Navigate to="/" replace />;
    }
    return (
        <Layout title="Profile">
            {isAuthenticated && !user && (
                <>

                    {userLoaded && (
                        <>
                            <UserSetup setOpen={setOpen} open={open} />
                        </>
                    )}


                </>
            )}
            {isAuthenticated && user && (
                <>

                    {user.organizations?.length > 0 && (
                        <>
                            <SelectAccountType setOpen={setOpen} />
                        </>
                    )}


                </>
            )}

            {user && (
                <>
                    <main className="test">
                      { location?.state && (location?.state as any).backPath && (
                          <div className="max-w-screen-xl mx-auto pb-1 px-4 sm:px-6 lg:pb-1 lg:px-8">
                            <div className="bg-white rounded-lg shadow ">
                                <div className='flex cursor-pointer' onClick={() => {navigate((location.state as any).backPath)}} >
                                    <span>
                                    <ArrowCircleLeftIcon className='h-6 w-6 mx-3 my-3' />
                                    </span>
                                    <span className='my-3'>
                                        Back
                                    </span>
                                </div>
                            </div>
                          </div>
                      )}
                        <div className="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                                    <aside className="py-6 lg:col-span-3">
                                        <nav className="space-y-1">
                                            {currentNav.map((item) => (
                                                <a
                                                    key={item.name}
                                                    onClick={() => { onSideNavClick(item) }}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-teal-50 border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-700'
                                                            : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                                                        'group border-l-4 px-3 py-2 flex items-center text-sm font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.current
                                                                ? 'text-teal-500 group-hover:text-teal-500'
                                                                : 'text-gray-400 group-hover:text-gray-500',
                                                            'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="truncate">{item.name}</span>
                                                </a>
                                            ))}
                                        </nav>
                                    </aside>

                                    <div className="divide-y divide-gray-200 lg:col-span-9" >
                                        {currentNav.map((item) => (
                                            <div key={item.name}>
                                                {item.current && (
                                                    <>
                                                        {item.page()}
                                                    </>
                                                )}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                </>
            )}
        </Layout>
    )
}
