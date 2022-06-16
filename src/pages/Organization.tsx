import { Layout } from '@/components'
import AddHelpRequestModal from '@/components/organization/AddHelpRequstModal';
import { OrganizationProfile, HelpRequest } from '@/declarations/api/api.did';
import { getProfileFull, getUserProfile, getOrganizationPublic, getOrganizationProfile } from '@/services/ApiService';
import { OrganizationProfile_, useAuth } from '@/utils';
import { OfficeBuildingIcon } from '@heroicons/react/outline';
import { CogIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const Organization = () => {
  let params = useParams();
  const [org, setOrg] = useState<OrganizationProfile_>();
  const navigate = useNavigate();
  const { isAuthenticated, user, logOut, identity, hasCheckedICUser } = useAuth();
  const [showAddRequest, showAddRequestSet] = useState<any>();
  const [activePerson, activePersonSet] = useState<BigInt | null>(null);
  useEffect(() => {
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

    }
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
  const filterRequests = (item)   => {
    if(activePerson) {
      if(item.personId != activePerson) return false;
    }
    return true;
  }
  return org && (
    <Layout title={`Organization Profile`}>
      {showAddRequest && (<AddHelpRequestModal open={showAddRequest} setOpen={onRequestAdded} organization={org} />)}
      {/* Header */}
      <div className='w-full bg-blue-200 h-200 px-7'>
        <div className="flex justify-between mt-5 mb-5">
          <div className=''>
            <h2 className='font-bold text-3xl flex'>
              <OfficeBuildingIcon className='h-10 w-10 mr-5'></OfficeBuildingIcon>
              {org.name}</h2>
            {org.userName?.length > 0 && (
              <p> {org.userName}</p>
            )}
          </div>
          <div className='flex space-x-10'>
            <div>
              <button className="relative px-6 py-2 group"
                onClick={onAddRequest}
              >
                <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-red-700 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full bg-white border-2 border-red-700 group-hover:bg-red-700"></span>
                <span className="relative text-red-700 group-hover:text-red-100"> Add Request </span>
              </button>
            </div>
            <CogIcon className='h-10 w-10 mr-10' onClick={() => {
              console.log('test')
              navigate(`/settings/organization/${org.organziationId}`, { state: { backPath: location.pathname } })
            }}> /</CogIcon>
          </div>

        </div>
      </div>
      <div className='bg-gray-700 p-10 h-500 w-full'>
        <h1 className='mt-10'>Persons</h1>
        <ul>
          {org.persons.map(person => (
            <li key={person.personId.toString()}>{person.name.first}</li>
          ))}
        </ul>
        <h1 className='mt-10'>Requests</h1>
        <ul>
          {org.requests.map(req => (
            <li key={req.requestId.toString()}>{req.name}</li>
          ))}
        </ul>
        <pre>{JSON.stringify(org, (k, v) => { typeof v === 'bigint' ? v.toString() : v }, 0)}</pre>
        Notes:
        <ul>
          <li>Show side menu: "Dashboard" (map of requests, helper locations), "Helpers" (list of all people who requested to be a helper for the organization?/ all user who) </li>
          <li>Users can apply to be a </li>
        </ul>
      </div>

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
                  value={activePerson?.toString()}
                  onChange={(evt) => { evt.target.value == "null" ? activePersonSet(null) : activePersonSet(BigInt(evt.target.value)); }}

                  autoComplete="person-name"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="null">Choose person ...</option>
                  {org.persons.map(person => (
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
                        Tags
                      </th>
                      <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {org.requests.filter(filterRequests).map((req) => (
                      <tr key={req.requestId.toString()}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {req.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {req.status['active'] == null && ("active")}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{req.person.name.first} {req.person.name.middle} {req.person.name.last}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{req.location.length > 0 ? req.location[0] : ("N/A")}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{JSON.stringify(req.tags, null, 2)}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {req.name}</span>
                          </a>
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

    </Layout>
  )
}


