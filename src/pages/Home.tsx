import { Layout } from '@/components'
import { Map } from '@/components/map/Map'
import { createHelpRequest } from '@/services/ApiService';
import { useAuth } from '@/utils';
import { useAppState } from '@/utils/AppState'
import { KeyIcon, UserIcon } from '@heroicons/react/outline';
import { HandIcon, OfficeBuildingIcon } from '@heroicons/react/solid';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  
  const { user, identity } = useAuth();
  const { currentItems, setCurrentItems, fetchFeed } = useAppState();
  const nav = useNavigate();
  const getPendingRequsets = () => {
    let count = 0;
    if (user?.organizations) {
      for (const org of user?.organizations!) {
        count += org.requests.filter(i => i.helpers.length > 0 && !i.approvedHelper[0]?.approved).length;
      }
    }
    return count;
  }
  const getNeedReviewRequsets = () => {
    let count = 0;
    if (user?.organizations) {
      for (const org of user?.organizations!) {
        count += org.requests.filter(i =>i.approvedHelper[0]?.approved && i.approvedHelper[0]?.complete && !i.approvedHelper[0]?.acceptComplete).length;
      }
    }
    return count;
  }
  useEffect(() => {
    console.log(currentItems)
  }, [currentItems])
  useEffect(() => {
    if(!currentItems[0]) fetchFeed()
  }, [])
  return (
    <Layout title="Home">
      {/* {!user && ("No User")} */}
      <div className='px-10 pt-5'>
        <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {user?.organizations.length == 0 && (<>
            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:bg-blue-200 hover:cursor-pointer"
              onClick={() => {
                nav("/help")
              }}>
              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">Help Requests</h3>

                  </div>
                  <p className="mt-1 text-gray-500 text-sm truncate">{user?.helpRequests.length}</p>
                </div>
                <HandIcon className="w-10 h-10  flex-shrink-0" />
              </div>

            </li>
            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:bg-blue-200 hover:cursor-pointer"
              onClick={() => {
                nav("/help")
              }}>

              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">Active Help Requests</h3>

                  </div>
                  <p className="mt-1 text-gray-500 text-sm truncate">{user?.helpRequests.filter(i => i.approvedHelper[0]?.approved && !i.approvedHelper[0]?.acceptComplete).length}</p>
                </div>
                <HandIcon className="w-10 h-10  flex-shrink-0 text-yellow-600" />
              </div>
            </li>
            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:bg-blue-200 hover:cursor-pointer"
              onClick={() => {
                nav("/help")
              }}>

              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">Completed Help Requests</h3>

                  </div>
                  <p className="mt-1 text-gray-500 text-sm truncate">{user?.helpRequests.filter(i => i.approvedHelper[0]?.complete).length}</p>
                </div>
                <HandIcon className="w-10 h-10  flex-shrink-0 text-green-600" />
              </div>
            </li>
          </>)}
          { }
          {user?.organizations && user.organizations.length > 0 && (<>

            {user.organizations.map(org => (
              <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:bg-blue-200 hover:cursor-pointer"
                onClick={() => {
                  nav(`/organization/${org.organziationId}`)
                }}>
                <div className="w-full flex items-center justify-between p-6 space-x-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-gray-900 text-sm font-medium truncate">{org.name}</h3>

                    </div>
                    <div className='flex mt-3'>
                      <span className="inline-flex items-center mr-3 px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-indigo-800">

                        <KeyIcon className='h-5 w-5' /> {org.requests.length}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-indigo-800">

                        <UserIcon className='h-5 w-5' /> {org.persons.length}
                      </span>

                    </div>
                  </div>
                  <OfficeBuildingIcon className="w-10 h-10  flex-shrink-0" />
                </div>

              </li>
            ))}
            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:bg-blue-200 hover:cursor-pointer"
              onClick={() => {
                nav("/request")
              }}>

              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">Pending</h3>

                  </div>
                  <p className="mt-1 text-gray-500 text-sm truncate">{getPendingRequsets()}</p>
                </div>
                <KeyIcon className="w-10 h-10 text-yellow-600 flex-shrink-0" />
              </div>
            </li>
            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:bg-blue-200 hover:cursor-pointer"
              onClick={() => {
                nav("/request")
              }}>

              <div className="w-full flex items-center justify-between p-6 space-x-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-900 text-sm font-medium truncate">Review</h3>

                  </div>
                  <p className="mt-1 text-gray-500 text-sm truncate">{getNeedReviewRequsets()}</p>
                </div>
                <HandIcon className="w-10 h-10 text-green-600 flex-shrink-0" />
              </div>
            </li>
          </>)}
        </ul>
        {/* {!user && (
          <Map />
        )} */}
        {user?.organizations[0] == undefined && (
          <Map />
        )}
      </div>
    </Layout>
  )
}
