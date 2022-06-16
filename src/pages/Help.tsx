import { Layout } from '@/components'
import { Map } from '@/components/map/Map'
import { createHelpRequest } from '@/services/ApiService';
import { useAuth } from '@/utils';
import { useAppState } from '@/utils/AppState'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Help = () => {
  
  const {user, identity} = useAuth();

  return (
    <Layout title="Help">
      <ul>
      <li>If the user is NOT setup to be a worker, show a promt to be a volunteer. Does the user need to request to be a helper for a organization?</li>

        <li>If the user is setup to be a worker, show current (pending, accepted, completed) help requests.</li>
      </ul>
    </Layout>
  )
}
