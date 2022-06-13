import { Layout } from '@/components'
import { useAuth } from '@/utils'
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

export const Settings = () => {

    const { user, identity, hasCheckedICUser, isAuthenticated } = useAuth();
    console.log(user, hasCheckedICUser, isAuthenticated)
    if(hasCheckedICUser) {
        if (!user && !isAuthenticated ) {
            return <Navigate to="/" replace />;
        }
    }
   
    return (
        <Layout title="Settings">
                     <h1>Settings</h1>

            <p>
                {identity?.getPrincipal().toText()}
            </p>
            <p>
                {identity?.getPrincipal().toHex()}
            </p>
        </Layout>
    )
}
