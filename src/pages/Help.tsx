import { Layout } from '@/components'
import { Map } from '@/components/map/Map'
import HelpRequstDetalsModal from '@/components/requests/HelpRequestDetailsModal';
import { Helper } from '@/declarations/api/api.did';
import { createHelpRequest, getProfileFull } from '@/services/ApiService';
import { useAuth, UserProfileFull_ } from '@/utils';
import { HelpRequestViewPublic_, useAppState } from '@/utils/AppState'
import { UserCircleIcon, CheckCircleIcon, ChevronRightIcon, DotsCircleHorizontalIcon, HandIcon, OfficeBuildingIcon } from '@heroicons/react/outline';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Help = () => {
  const navigate = useNavigate();
  const { user, identity, hasCheckedICUser, setUser } = useAuth();
  const [showVolunteerSetup, showVolunteerSetupSet] = useState(false);
  const [activeRequest, activeRequestSet] = useState<HelpRequestViewPublic_ | null>(null);
  const [showDetailsModal, showDetailsModalSet] = useState(false);


  useEffect(() => {
    showVolunteerSetupSet(user?.helpRequests.length == 0);
    if(!user && hasCheckedICUser) navigate("/")
 
  }, [user, hasCheckedICUser])
  useEffect(() => {
    if(!user && hasCheckedICUser) return
    if(!hasCheckedICUser) return;
    getProfileFull().then((a) => {
      if(a)  setUser(a as UserProfileFull_);
     })
  }, [hasCheckedICUser])

  const requestModalNext = (show : boolean, type: string) => {
    if(!activeRequest) return;
    if(type == 'request') {
      if(!activeRequest.approvedHelper[0]) {
        let aNew :Helper  = {
          acceptComplete: false,
          userId: "",
          createdAt: 0n,
          complete: false,
          updatedAt: 0n,
          approved: false
        };
        activeRequest.approvedHelper[0] = aNew;
      } 
    }
    if(type == 'complete') {
      if(activeRequest.approvedHelper[0]) {
        activeRequest.approvedHelper[0].complete = true;
      } 
    }
    showDetailsModalSet(show);
  }

  return (
    <Layout title="Help">
      {showDetailsModal && (
        <HelpRequstDetalsModal setOpen={requestModalNext} open={showDetailsModal} request={activeRequest!} />
      )}

      {showVolunteerSetup && (
        <>
          <div className="bg-white">
            <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block">Ready to help?</span>
                <span className="block">Start creating requesting to help out today.</span>
              </h2>
              <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <a
                    onClick={() => {
                      navigate("/")
                    }}
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Get started
                  </a>
                </div>
                <div className="ml-3 inline-flex">
                  <a
                    onClick={() => {
                      navigate("/about")
                    }}
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {!showVolunteerSetup && (
        <main>
          <div className='bg-white shadow sm:rounded-md mt-5 mx-10'>

            <div className="sm:flex sm:items-center py-2 px-4">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Approved</h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the help requests you have in progress.
                </p>
              </div>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {user?.helpRequests.filter(i => i.approvedHelper[0]?.approved && !i.approvedHelper[0]?.complete).reverse().map((item) => (
                <li key={item.requestId.toString()} className="hover:bg-blue-200 hover:cursor-pointer">
                  <a onClick={() => {
                    activeRequestSet(item); showDetailsModalSet(true);
                  }} className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          {/* <img className="h-12 w-12 rounded-full" src={item.applicant.imageUrl} alt="" /> */}
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="text-sm font-medium text-indigo-600 truncate">{item.name}</p>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              {item.description}
                            </p>
                            <p className="flex mt-2"><OfficeBuildingIcon className="h-4 w-4" /> <span className="text-sm font-medium truncate">{item.organization.name}</span></p>
                          </div>
                          {/* <div className="hidden md:block"> */}

                          <div className="md:block">

                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <span className='flex p-2 mt-2'  >
                                {(!(item.approvedHelper[0])) && (<DotsCircleHorizontalIcon className='h-5 w-5 ' />)}
                                {item.approvedHelper[0] && (!item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (<HandIcon className='h-5 w-5 ' />)}
                                {(item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (<HandIcon className=' h-5 w-5 text-yellow-600' />)}
                                {(item.approvedHelper[0]?.approved && item.approvedHelper[0]?.complete) && (<HandIcon className=' h-5 w-5 text-green-600' />)}
                              </span>
                              <p className="mt-1">
                                {!(item.approvedHelper[0]) && (
                                  <>Open</>
                                )}
                                {item.approvedHelper[0] && (!item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (
                                  <>Requested</>
                                )}
                                {item.approvedHelper[0]?.complete && (
                                  <>{"Review"}</>
                                )}
                              </p>
                            </div>

                          </div>
                        </div>
                      </div>
                      <div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className='bg-white shadow  sm:rounded-md mt-5 mx-10'>
            <div className="sm:flex sm:items-center py-2 px-4">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Pending</h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the help requests you applied for that have not been accepted.
                </p>
              </div>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {user?.helpRequests.filter(i => !i.approvedHelper[0]?.complete && !i.approvedHelper[0]?.approved).reverse().map((item) => (
                <li key={item.requestId.toString()} className="hover:bg-blue-200 hover:cursor-pointer">
                  <a onClick={() => {
                    activeRequestSet(item); showDetailsModalSet(true);
                  }} className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          {/* <img className="h-12 w-12 rounded-full" src={item.applicant.imageUrl} alt="" /> */}
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="text-sm font-medium text-indigo-600 truncate">{item.name}</p>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              {item.description}
                            </p>
                            <p className="flex mt-2"><OfficeBuildingIcon className="h-4 w-4" /> <span className="text-sm font-medium truncate">{item.organization.name}</span></p>
                          </div>
                          {/* <div className="hidden md:block"> */}

                          <div className="md:block">
                            <div>

                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className='flex p-2 mt-2'  >
                                  {(!(item.approvedHelper[0])) && (<DotsCircleHorizontalIcon className='h-5 w-5 ' />)}
                                  {item.approvedHelper[0] && (!item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (<HandIcon className='h-5 w-5 ' />)}
                                  {(item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (<HandIcon className=' h-5 w-5 text-yellow-600' />)}
                                  {(item.approvedHelper[0]?.approved && item.approvedHelper[0]?.complete) && (<HandIcon className=' h-5 w-5 text-green-600' />)}
                                </span>
                                <p className="mt-1">
                                  {!(item.approvedHelper[0]) && (
                                    <>Open</>
                                  )}
                                  {item.approvedHelper[0] && (!item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (
                                    <>Requested</>
                                  )}
                                  {item.approvedHelper[0]?.approved && (
                                    <>{"Review"}</>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className='bg-white shadow sm:rounded-md mt-5 mx-10'>

            <div className="sm:flex sm:items-center py-2 px-4">
              <div className="sm:flex-auto">
                <h1 className="text-xl font-semibold text-gray-900">Completed</h1>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the completed help requests.
                </p>
              </div>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {user?.helpRequests.filter(i => i.approvedHelper[0]?.complete).reverse().map((item) => (
                <li key={item.requestId.toString()} className="hover:bg-blue-200 hover:cursor-pointer">
                  <a onClick={() => {
                    activeRequestSet(item); showDetailsModalSet(true);
                  }} className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          {/* <img className="h-12 w-12 rounded-full" src={item.applicant.imageUrl} alt="" /> */}
                        </div>
                        <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="text-sm font-medium text-indigo-600 truncate">{item.name}</p>
                            <p className="mt-2 flex items-center text-sm text-gray-500">
                              {item.description}
                            </p>
                            <p className="flex mt-2"><OfficeBuildingIcon className="h-4 w-4" /> <span className="text-sm font-medium truncate">{item.organization.name}</span></p>
                          </div>
                          {/* <div className="hidden md:block"> */}

                          <div className="md:block">
                            <div>


                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className='flex p-2 mt-2'  >
                                  {(!(item.approvedHelper[0])) && (<DotsCircleHorizontalIcon className='h-5 w-5 ' />)}
                                  {item.approvedHelper[0] && (!item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (<HandIcon className='h-5 w-5 ' />)}
                                  {(item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (<HandIcon className=' h-5 w-5 text-yellow-600' />)}
                                  {(item.approvedHelper[0]?.approved && item.approvedHelper[0]?.complete) && (<HandIcon className=' h-5 w-5 text-green-600' />)}
                                </span>
                                <p className="mt-1">
                                  {!(item.approvedHelper[0]) && (
                                    <>Open</>
                                  )}
                                  {item.approvedHelper[0] && (!item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (
                                    <>Requested</>
                                  )}
                                  {item.approvedHelper[0]?.complete && (
                                    <>
                                    {!item.approvedHelper[0]?.acceptComplete && <>{"In Review"}</>} 
                                    {item.approvedHelper[0]?.acceptComplete && <>{"Accepted"}</>} 

                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </main>)}

    </Layout>
  )
}

