import { Layout } from '@/components'
import { Map } from '@/components/map/Map'
import { createHelpRequest } from '@/services/ApiService';
import { useAuth } from '@/utils';
import { useAppState } from '@/utils/AppState'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  
  const {user, identity} = useAuth();

  return (
    <Layout title="Home">
     <Map />
    {/* {user && currentItems?.length == 0 && (
       <button
       onClick={async () => {
  
        const item = await createHelpRequest({
          caption: "Caption of the items" ,
          name: "The  name of the item",
          tags: [],
        })
       }}
       >
        Add Post
       </button>
    )} */}
   
    </Layout>
  )
}
