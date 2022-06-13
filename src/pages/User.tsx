import { Layout } from '@/components'
import { getUserProfile } from '@/services/ApiService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const User = () => {
    let params = useParams();
    const [user, setUser] = useState<any>();

    useEffect(() => {
      const fetchData = async () => {
        console.log('params', params)
        if (!params.userId) return;
        const userProfile = await getUserProfile(params.userId);
        setUser(userProfile);
        console.log(user, userProfile)
      }
      fetchData()

    }, []);
    return user && (
        <Layout title={`User Profile | ${user?.userName ?? ''}`}>
            User:  {user.userName}
        </Layout>
    )
}
