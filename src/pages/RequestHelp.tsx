import { Layout } from '@/components'
import { Map } from '@/components/map/Map'
import { createHelpRequest } from '@/services/ApiService';
import { useAuth } from '@/utils';
import { useAppState } from '@/utils/AppState'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const RequestHelp = () => {
  
  const {user, identity} = useAuth();

  return (
    <Layout title="Request Help">
  <ul>
    <li>If user does not have a organization, promt the user to setup a non profit.</li>
    <li className='mt-10'>If the user does have a organization 
      <ul className='ml-12'>
        <li>
        show the current help request create, 
        </li>
        <li>
        ability to create a new one.
        </li>
        <li>
          open the details of each one (modal?)
        </li>
      </ul>
    </li>

  </ul>
    </Layout>
  )
}
