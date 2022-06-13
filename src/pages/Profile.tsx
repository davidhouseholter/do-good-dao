import { Layout } from '@/components'
import UserSetup from '@/components/modals/UserSetup';
import { getUserProfile } from '@/services/ApiService';
import { useAuth } from '@/utils'
import { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

export const Profile = () => {

    const { isAuthenticated, user, logOut, identity, hasCheckedICUser } = useAuth();
    const [open, setOpen] = useState(true);
    const [userLoaded, setUserLoaded] = useState(false);
    const [userProfile, setUserProfile] = useState<any>();

    if (!user && hasCheckedICUser) {
        return <Navigate to="/" replace />;
    }
    useEffect(() => {
        const fetchData = async () => {
          console.log('user', user, hasCheckedICUser)
         
          const userProfile_ = await getUserProfile(user.userName);
          setUserProfile(userProfile_);
          console.log(userProfile_)
        }
        if(hasCheckedICUser){
            fetchData()
        }
  
    }, [hasCheckedICUser]);
    return (
        <Layout title="Profile">
            <h1>Profile: {userProfile?.userName} </h1>
            {isAuthenticated && !user && (
                <>

                    {userLoaded && (
                        <>
                            <UserSetup setOpen={setOpen} open={open} />
                        </>
                    )}


                </>
            )}
            <p>
                {identity?.getPrincipal().toText()}
            </p>
            <p>
                {identity?.getPrincipal().toHex()}
            </p>
        </Layout>
    )
}
