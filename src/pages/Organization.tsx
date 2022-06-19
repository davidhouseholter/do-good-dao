import { Layout } from '@/components'
import AddHelpRequestModal from '@/components/organization/AddHelpRequstModal';
import OwnerHelpRequstDetalsModal from '@/components/requests/OwnerHelpRequestDetailsModal';
import { OrganizationProfile, HelpRequest } from '@/declarations/api/api.did';
import { getProfileFull, getUserProfile, getOrganizationPublic, getOrganizationProfile } from '@/services/ApiService';
import { HelpRequest_, OrganizationProfile_, useAuth } from '@/utils';
import { HelpRequestViewPublic_ } from '@/utils/AppState';
import { CheckCircleIcon, CreditCardIcon, DotsCircleHorizontalIcon, KeyIcon, MapIcon, OfficeBuildingIcon, UserIcon, UsersIcon } from '@heroicons/react/outline';
import { CogIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
function getDateText(req: HelpRequest_) {
  const start = new Date(req.startDateText).toLocaleDateString();
  const due = new Date(req.dueDateText).toLocaleDateString();

  if(start == "Invalid Date") {
    if(due == "Invalid Date") {
      return  <> {req.dueDateText}</>
    }
    return <>{new Date(req.dueDateText).toLocaleDateString()}</>
  }
  return <> {req.dueDateText}</>
}
export const Organization = () => {
  let params = useParams();
  const location = useLocation()
  const [org, setOrg] = useState<OrganizationProfile_>();
  const navigate = useNavigate();
  const { isAuthenticated, user, logOut, identity, hasCheckedICUser } = useAuth();
  const [showAddRequest, showAddRequestSet] = useState<any>();
  const [activeFilterPerson, activeFilterPersonSet] = useState<BigInt | null>(null);

  const tabs_ = [
    { id: 1, name: 'Dashboard', href: '#', icon: OfficeBuildingIcon, current: true },
    { id: 2, name: 'Complete', href: '#', icon: KeyIcon, current: false },
    { id: 3, name: 'People', href: '#', icon: UsersIcon, current: false },
    { id: 4, name: 'Map', href: '#', icon: MapIcon, current: false },
  ]
  const [activeTab, activeTabSet] = useState<any>(tabs_[0]);
  const [tabs, tabsSet] = useState<any[]>(tabs_);
  const fetchData = async () => {
    if (!params.orgId) return;
    const orgData = await getOrganizationProfile(BigInt(params.orgId)) as OrganizationProfile_;
    if (orgData === null) {
      navigate("/");
      return;
    }
    orgData.requests = orgData.requests.map(req => {
      req.person = orgData.persons.find(i => i.personId == req.personId)!;
      return req;
    });
    setOrg(orgData!);

    if ((location.state as any)?.requestId) {
      const request = orgData?.requests.find(i => i.requestId == BigInt((location.state as any)?.requestId));
      if (request) {
        activeRequestSet(request);
        showDetailsModalSet(true);
        navigate(location.pathname, { replace: true });
      }

    };
  }
  useEffect(() => {
    if (hasCheckedICUser) {
      fetchData()
    }
  }, [hasCheckedICUser, user]);

  const onAddRequest = () => {
    showAddRequestSet(true);
  }
  const onRequestAdded = (show, newRequest: any) => {
    if (newRequest != null) {
      setOrg({ ...org!, requests: [...org!.requests, newRequest] })
    }
    showAddRequestSet(show);
  };
  const filterRequests = (item) => {
    if (activeFilterPerson) {
      if (item.personId != activeFilterPerson) return false;
    }
    return true;
  }


  const onSetTab = async (tab: any) => {
    tabsSet([...tabs_.map(i => {
      return { ...i, current: tab.id == i.id }
    })]);
    activeTabSet(tab);
  };

  const [showDetailsModal, showDetailsModalSet] = useState(false);
  const [activeRequest, activeRequestSet] = useState<HelpRequest_ | null>(null);

  const requestModalNext = (show: boolean, type: string, helperId: any) => {
    if (type == 'approve') {
      if (activeRequest) {
        const helpers = [...activeRequest.helpers.map(i => { return { ...i, approved: i.userId == helperId } })];
        const helper = helpers.find(i => i.userId == helperId);
        if (org) {
          console.log([...org.requests.filter(i => i.requestId != activeRequest.requestId), { ...activeRequest, helpers: helpers }])
          setOrg({
            ...org, requests: [...org.requests.filter(i => i.requestId != activeRequest.requestId), {
              ...activeRequest, helpers: helpers, approvedHelper: [{
                acceptComplete: false,
                approved: true,
                complete: false,
                createdAt: 0n,
                updatedAt: 0n,
                userId: helperId
              }]
            }]
          })
        }
      }
    }
    if (type == 'complete') {
      if (activeRequest) {
        const helpers = [...activeRequest.helpers.map(i => { return { ...i, approved: i.userId == helperId } })];
        if (org) {
          setOrg({
            ...org, requests: [...org.requests.filter(i => i.requestId != activeRequest.requestId), {
              ...activeRequest, helpers: helpers, approvedHelper: [{
                acceptComplete: true,
                approved: true,
                complete: true,
                createdAt: 0n,
                updatedAt: 0n,
                userId: helperId
              }]
            }]
          })
        }
      }
    }
    showDetailsModalSet(show);
  }
  return org && (
    <Layout title={`Organization Profile`}>
      {showAddRequest && (<AddHelpRequestModal open={showAddRequest} setOpen={onRequestAdded} organization={org} />)}
      {showDetailsModal && (
        <OwnerHelpRequstDetalsModal setOpen={requestModalNext} open={showDetailsModal} request={activeRequest!} />
      )}
      {/* Header */}
      <div className='w-full h-200 px-7'>
        <div className="flex  justify-between mt-5 mb-5">
          <div className=''>
            <h2 className='font-bold text-3xl flex'>
              {org.name}</h2>
            {org.userName?.length > 0 && (
              <p> {org.userName}</p>
            )}
          </div>
          <div className='flex space-x-10'>
            <div>
              <button className="relative px-6 py-2 group" onClick={onAddRequest}>
                <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-red-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full bg-white border-2 border-red-700 group-hover:bg-red-700"></span>
                <span className="relative text-red-700 group-hover:text-red-100"> Add Request </span>
              </button>
            </div>
            <CogIcon className='h-10 w-10 mr-10' onClick={() => {
              navigate(`/settings/organization/${org.organziationId}`, { state: { backPath: location.pathname } })
            }}> /</CogIcon>
          </div>

        </div>
        <div>
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
              defaultValue={tabs.find((tab) => tab.current)!.name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <a
                    key={tab.name}
                    onClick={() => {
                      onSetTab(tab)
                    }}
                    className={classNames(
                      tab.current
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
                    )}
                    aria-current={tab.current ? 'page' : undefined}
                  >
                    <tab.icon
                      className={classNames(
                        tab.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                        '-ml-0.5 mr-2 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    <span>{tab.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
      <section>
        {activeTab.id == 1 && (
          <>
            <div className="px-4 sm:px-6 lg:px-8 mt-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-gray-900">Help Requests</h1>
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all the active help requests.
                  </p>
                </div>
                <div className='mr-5'>
                  <div className="col-span-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        name="status"
                        // value={activePerson?.toString()}
                        // onChange={(evt) => { evt.target.value == "null" ? activePersonSet(null) : activePersonSet(BigInt(evt.target.value)); }}

                        autoComplete="status"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="null">Choose status</option>

                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="col-span-4">
                    <label htmlFor="personId" className="block text-sm font-medium text-gray-700">
                      Person
                    </label>
                    <div className="mt-1">
                      <select
                        id="personId"
                        name="personId"
                        value={activeFilterPerson?.toString()}
                        onChange={(evt) => { evt.target.value == "null" ? activeFilterPersonSet(null) : activeFilterPersonSet(BigInt(evt.target.value)); }}

                        autoComplete="person-name"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="null">Choose person ...</option>
                        {org?.persons.map(person => (
                          <option key={person.personId.toString()} value={person.personId.toString()}>{person.name.first} {person.name.last}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  {/* <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add user
            </button> */}
                </div>
              </div>
              <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                              Person
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Location
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Helpers
                            </th>
                            <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {org.requests.filter(i => !i.approvedHelper[0]?.acceptComplete).filter(filterRequests).map((req) => (
                            <tr key={req.requestId.toString()}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                <p className='font-medium '> {req.name}</p>
                                {/* <p>
                                  {JSON.stringify(req.tags, null, 2)}
                                </p> */}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {/* {req.status['active'] == null && ("active")} */}
                                <p className="mt-1">
                                  {!(req.approvedHelper[0]) && (
                                    <>Open</>
                                  )}
                                  {req.approvedHelper[0] && (!req.approvedHelper[0]?.approved && !req.approvedHelper[0]?.complete) && (
                                    <>Requested</>
                                  )}
                                  {req.approvedHelper[0]?.complete && (
                                    <>
                                      {!req.approvedHelper[0]?.acceptComplete && <>{"In Review"}</>}
                                      {req.approvedHelper[0]?.acceptComplete && <>{"Accepted"}</>}

                                    </>
                                  )}
                                </p>
                              </td>
                              <td> 
                                {getDateText(req)}
                                {/* {() => {
                                  try {
                                    console.log('asdfasfsdfasdfdsfas');
                                    <>{new Date(req.startDateText).toLocaleDateString()} -  {new Date(req.dueDateText).toLocaleDateString()}</>
                                  } catch {
                                    {req.dueDateText}
                                  }
                                }} */}
                                </td>
                              {/* <td>
                                {new Date(req.startDateText).toLocaleDateString()} -  {new Date(req.dueDateText).toLocaleDateString()}
                              </td> */}
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{req.person && (
                                <p>{req.person.name.first} {req.person.name.middle} {req.person.name.last}</p>
                              )}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{req.location.length > 0 ? req.location[0] : ("N/A")}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className='flex'>
                                  {req.approvedHelper.length}  of {req.helpers.length}
                                  {req.approvedHelper.length == 0 && req.helpers.length == 0 && (<DotsCircleHorizontalIcon className='ml-2 h-5 w-5 ' />)}
                                  {req.approvedHelper.length == 0 && req.helpers.length > 0 && (<CheckCircleIcon className='ml-2 h-5 w-5 text-yellow-600' />)}
                                  {req.approvedHelper.length > 0 && req.helpers.length > 0 && (<CheckCircleIcon className='ml-2 h-5 w-5 text-green-600' />)}
                                </span>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                {req.approvedHelper[0]?.complete && (
                                  <>
                                    {!req.approvedHelper[0]?.acceptComplete && <>
                                      <button className="relative px-6 py-2 group mr-3"
                                        onClick={() => {
                                          activeRequestSet(req); showDetailsModalSet(true);
                                        }}
                                      >
                                        <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-blue-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                                        <span className="absolute inset-0 w-full h-full bg-white border-2 border-blue-700 group-hover:bg-blue-700"></span>
                                        <span className="relative text-blue-700 group-hover:text-blue-100"> Complete </span>
                                      </button>
                                    </>}
                                    {req.approvedHelper[0]?.acceptComplete && <>{"Accepted"}</>}

                                  </>
                                )}
                                 {!req.approvedHelper[0]?.approved && (
                                  <>
                                    {req.approvedHelper.length == 0 && req.helpers.length > 0 && <>
                                      <button className="relative px-6 py-2 group mr-3"
                                        onClick={() => {
                                          activeRequestSet(req); showDetailsModalSet(true);
                                        }}
                                      >
                                        <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-blue-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                                        <span className="absolute inset-0 w-full h-full bg-white border-2 border-blue-700 group-hover:bg-blue-700"></span>
                                        <span className="relative text-blue-700 group-hover:text-blue-100"> Approve </span>
                                      </button>
                                    </>}
                                    {req.approvedHelper[0]?.acceptComplete && <>{"Accepted"}</>}

                                  </>
                                )}
                                <button className="relative px-6 py-2 group"
                                  onClick={() => {
                                    activeRequestSet(req); showDetailsModalSet(true);
                                  }}
                                >
                                  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-red-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                                  <span className="absolute inset-0 w-full h-full bg-white border-2 border-red-700 group-hover:bg-red-700"></span>
                                  <span className="relative text-red-700 group-hover:text-red-100"> View Details </span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab.id == 2 && (
          <>
            <div className="px-4 sm:px-6 lg:px-8 mt-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-gray-900">Completed Requests</h1>
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all the active help requests.
                  </p>
                </div>
                <div className='mr-5'>
                  <div className="col-span-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      <select
                        id="status"
                        name="status"
                        // value={activePerson?.toString()}
                        // onChange={(evt) => { evt.target.value == "null" ? activePersonSet(null) : activePersonSet(BigInt(evt.target.value)); }}

                        autoComplete="status"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="null">Choose status</option>

                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="col-span-4">
                    <label htmlFor="personId" className="block text-sm font-medium text-gray-700">
                      Person
                    </label>
                    <div className="mt-1">
                      <select
                        id="personId"
                        name="personId"
                        value={activeFilterPerson?.toString()}
                        onChange={(evt) => { evt.target.value == "null" ? activeFilterPersonSet(null) : activeFilterPersonSet(BigInt(evt.target.value)); }}

                        autoComplete="person-name"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="null">Choose person ...</option>
                        {org?.persons.map(person => (
                          <option key={person.personId.toString()} value={person.personId.toString()}>{person.name.first} {person.name.last}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  {/* <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add user
            </button> */}
                </div>
              </div>
              <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                              Person
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Location
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                            >
                              Helpers
                            </th>
                            <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {org.requests.filter(i => i.approvedHelper[0]?.acceptComplete).filter(filterRequests).map((req) => (
                            <tr key={req.requestId.toString()}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                <p className='font-medium '> {req.name}</p>
                                <p>
                                  {JSON.stringify(req.tags, null, 2)}
                                </p>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {/* {req.status['active'] == null && ("active")} */}
                                <p className="mt-1">
                                  {!(req.approvedHelper[0]) && (
                                    <>Open</>
                                  )}
                                  {req.approvedHelper[0] && (!req.approvedHelper[0]?.approved && !req.approvedHelper[0]?.complete) && (
                                    <>Requested</>
                                  )}
                                  {req.approvedHelper[0]?.complete && (
                                    <>
                                      {!req.approvedHelper[0]?.acceptComplete && <>{"In Review"}</>}
                                      {req.approvedHelper[0]?.acceptComplete && <>{"Accepted"}</>}

                                    </>
                                  )}
                                </p>
                              </td>
                              <td> {new Date(req.startDateText).toLocaleDateString()} -  {new Date(req.dueDateText).toLocaleDateString()}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{req.person && (
                                <p>{req.person.name.first} {req.person.name.middle} {req.person.name.last}</p>
                              )}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{req.location.length > 0 ? req.location[0] : ("N/A")}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className='flex'>
                                  {req.approvedHelper.length}  of {req.helpers.length}
                                  {req.approvedHelper.length == 0 && req.helpers.length == 0 && (<DotsCircleHorizontalIcon className='ml-2 h-5 w-5 ' />)}
                                  {req.approvedHelper.length == 0 && req.helpers.length > 0 && (<CheckCircleIcon className='ml-2 h-5 w-5 text-yellow-600' />)}
                                  {req.approvedHelper.length > 0 && req.helpers.length > 0 && (<CheckCircleIcon className='ml-2 h-5 w-5 text-green-600' />)}
                                </span>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button className="relative px-6 py-2 group"
                                  onClick={() => {
                                    activeRequestSet(req); showDetailsModalSet(true);
                                  }}
                                >
                                  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-red-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                                  <span className="absolute inset-0 w-full h-full bg-white border-2 border-red-700 group-hover:bg-red-700"></span>
                                  <span className="relative text-red-700 group-hover:text-red-100"> View Details </span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab.id == 3 && (
          <>
            <div className="px-4 sm:px-6 lg:px-8 mt-8">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-gray-900">People</h1>
                  <p className="mt-2 text-sm text-gray-700">
                    A list of all the personed helped.
                  </p>
                </div>


              </div>
              <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                            >
                              Name
                            </th>

                            <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {org?.persons.map((person) => (
                            <tr key={person.personId.toString()}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                <p>{person.name.first} {person.name.middle} {person.name.last}</p>


                              </td>

                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <button className="relative px-6 py-2 group"
                                  onClick={() => {

                                  }}
                                >
                                  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-red-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                                  <span className="absolute inset-0 w-full h-full bg-white border-2 border-red-700 group-hover:bg-red-700"></span>
                                  <span className="relative text-red-700 group-hover:text-red-100"> View Details </span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>


    </Layout>
  )
}


