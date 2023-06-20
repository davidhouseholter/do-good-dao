import { Fragment, useState, ExoticComponent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { KeyIcon, UserCircleIcon, XIcon } from '@heroicons/react/outline'
import { checkUsername, createHelpRequest, createUser } from '@/services/ApiService';
import { useAuth } from '@/utils';
import { HelpRequestInit, HelpRequestViewPublic, OrganizationProfile, PersonCreate } from '@/declarations/api/api.did';
interface Props {
  request: HelpRequestViewPublic;
}
export default function HelpRequstDetal({ request }: Props) {
  console.log(request)
  return (
    <>
      <h2 className='text-lg leading-6 font-medium text-gray-900'>{request.name}</h2>
      <p>{request.description}</p>
      <div className='mt-5'>
        <p><span className='font-medium'>Non Profit: </span>{request.organization.name}</p>
        <p>

          {request.status['active'] == null && <>
            <UserCircleIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" aria-hidden="true" />
            <span>active</span>
          </>}

        </p>
        <p>Tags</p>
        <p>Location</p>
      </div>
    </>
  )
};