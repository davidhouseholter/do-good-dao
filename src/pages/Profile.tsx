import { Layout } from '@/components'
import UserSetup from '@/components/modals/UserSetup';
import SelectAccountType from '@/components/user/AccountSetup';
import ProfileEdit from '@/components/user/ProfileEdit';
import { getUserProfile } from '@/services/ApiService';
import { useAuth } from '@/utils'
import { Switch } from '@headlessui/react';
import { UserCircleIcon, CogIcon, KeyIcon, BellIcon, CreditCardIcon, ViewGridAddIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

export const Profile = () => {
    const subNavigation = [
        { name: 'Profile', href: '', icon: UserCircleIcon, current: true, page: () => <ProfileEdit user={user} /> },
        { name: 'Account', href: '/', icon: CogIcon, current: false,  page: () => <ProfileEdit user={user} /> },

      ];
      const [currentNav, setCurrentNav] = useState<any>(subNavigation[0]);
      console.log('currentNav', currentNav)
    const { isAuthenticated, user, logOut, identity, hasCheckedICUser } = useAuth();
    const [open, setOpen] = useState(true);
    const [userLoaded, setUserLoaded] = useState(false);
    const [userProfile, setUserProfile] = useState<any>();
    console.log(user, hasCheckedICUser);
    if (!user && hasCheckedICUser) {
        console.log('sfdsd')
        return <Navigate to="/" replace />;
    }
    useEffect(() => {
        const fetchData = async () => {

            const userProfile_ = await getUserProfile(user!.userName);
            setUserProfile(userProfile_);
        }
        if (hasCheckedICUser) {
            fetchData()
        }

    }, [hasCheckedICUser, user]);
    return user && (
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
      
            <main className="">
                <div className="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                            <aside className="py-6 lg:col-span-3">
                                <nav className="space-y-1">
                                    {subNavigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
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
                                {subNavigation.map((item) => (
                                     <>
                                      {item.current && (
                                        <>
                                        {item.page()}
                                        </>
                                      )}
                                      </>
                                ))}
                              
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </Layout>
    )
}
