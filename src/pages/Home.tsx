import { Layout } from '@/components'
import { Map } from '@/components/map/Map'
import { createHelpRequest } from '@/services/ApiService';
import { useAuth } from '@/utils';
import { useAppState } from '@/utils/AppState'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const {currentItems, setCurrentItems} = useAppState();
  const {user, identity} = useAuth();

const navigate = useNavigate();
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
    {currentItems?.length > 0 && (
      currentItems.map(item => (
        <div key={item.itemId}>
          <h3>{item.name}</h3>
          <p>{item.caption}</p>
          <p className='flex '>
            <span className='mr-2'>Username: </span>
            <a onClick={() => {
              navigate(`/users/${item.userId}`)
            }}
            >{item.userId}</a>
          </p>
        </div>
      ))
    )}
    </Layout>
  )
}
