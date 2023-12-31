import { OrganizationProfile, UserProfile } from "@/declarations/api/api.did";
import { editOrganization } from "@/services/ApiService";
import { HelpRequestViewPublic_ } from "@/utils/AppState";
import { Switch } from "@headlessui/react";
import { useState } from "react";
interface Props {
    user: UserProfile;
    org: OrganizationProfile
}
export default function OrganizationEdit({ user, org } : Props) {
     
    const [showOrganizationSetup, setOrganizationSetup] = useState<any>();
    const [orgDataStatic, setOrgDataStatic] = useState<any | undefined>();
    if(org && !orgDataStatic) {
        setOrgDataStatic({...org});
    } 
    const user2 = {
        imageUrl:
            'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=320&h=320&q=80',
    }


    const onCancel = () => {
        setOrgDataStatic(org);
    }
    const onSave = () => {
        console.log(orgDataStatic)
        editOrganization(org.organziationId, orgDataStatic)
        
    }
   
    return orgDataStatic && (
        <>

            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg leading-6 font-s text-gray-900">{org.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        This information will be displayed publicly so be careful what you share.
                    </p>
                </div>

                <div className="mt-6 flex flex-col lg:flex-row">
                    <div className="flex-grow space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1 rounded-md shadow-sm flex">
                                <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 inline-flex items-center text-gray-500 sm:text-sm">
                                https://6quih-xqaaa-aaaam-aamna-cai.ic0.app/users/
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    autoComplete="username"
                                    onChange={(evt) => setOrgDataStatic({ ...org, username: evt.target.value })}
                                    className="focus:ring-sky-500 focus:border-sky-500 flex-grow block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                                    value={org?.userName ?? ''}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                About
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="about"
                                    name="about"
                                    rows={3}
                                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                    value={orgDataStatic.about}
                                    onChange={(evt) => setOrgDataStatic({ ...org, about: evt.target.value })}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Brief description for your profile. URLs are hyperlinked.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-grow-0 lg:flex-shrink-0">
                        <p className="text-sm font-medium text-gray-700" aria-hidden="true">
                            Photo
                        </p>
                        <div className="mt-1 lg:hidden">
                            <div className="flex items-center">
                                <div
                                    className="flex-shrink-0 inline-block rounded-full overflow-hidden h-12 w-12"
                                    aria-hidden="true"
                                >
                                    <img className="rounded-full h-full w-full" src={user2.imageUrl} alt="" />
                                </div>
                                <div className="ml-5 rounded-md shadow-sm">
                                    <div className="group relative border border-gray-300 rounded-md py-2 px-3 flex items-center justify-center hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500">
                                        <label
                                            htmlFor="mobile-user-photo"
                                            className="relative text-sm leading-4 font-medium text-gray-700 pointer-events-none"
                                        >
                                            <span>Change</span>
                                            <span className="sr-only"> user photo</span>
                                        </label>
                                        <input
                                            id="mobile-user-photo"
                                            name="user-photo"
                                            type="file"
                                            className="absolute w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden relative rounded-full overflow-hidden lg:block">
                            <img className="relative rounded-full w-40 h-40" src={user2.imageUrl} alt="" />
                            <label
                                htmlFor="desktop-user-photo"
                                className="absolute inset-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100"
                            >
                                <span>Change</span>
                                <span className="sr-only"> user photo</span>
                                <input
                                    type="file"
                                    id="desktop-user-photo"
                                    name="user-photo"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-6">
                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="organization-name"
                            value={orgDataStatic.name}
                            onChange={(evt) => setOrgDataStatic({ ...org, name: evt.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        />
                    </div>

                    <div className="col-span-12">
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                            URL
                        </label>
                        <input
                            type="text"
                            name="url"
                            id="url"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        />
                    </div>

                </div>
                <div className="mt-4 py-4 px-4 flex justify-end sm:px-6">
                                        <button
                                            type="button"
                                            className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                            onClick={onCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="ml-5 bg-sky-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                            onClick={onSave}
                                        >
                                            Save
                                        </button>
                                    </div>
            </div>
        </>
    )
}