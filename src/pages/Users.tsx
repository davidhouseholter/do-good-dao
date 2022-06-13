import { Layout } from '@/components'
import { UserProfile } from '@/declarations/api/api.did';
import { getUserProfile, getUsersPublic } from '@/services/ApiService';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const Users = () => {
  const [users, setUsers] = useState<UserProfile[]>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {

      const users_ = await getUsersPublic(10n);
      setUsers(users_);
      console.log(users_, users)
    }
    fetchData()

  }, []);
  return (
    <Layout title="Home">
      All Users
      <ul>
        {users && users.map(user => (
          <li key={user.userName}
            onClick={() => { navigate(`/users/${user.userName}`) }}
          >{user.userName}</li>

        ))}
      </ul>
    </Layout>
  )
}
