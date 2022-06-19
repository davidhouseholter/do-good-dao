import { Fragment, useState, ExoticComponent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { KeyIcon, MapIcon, PhoneIcon, PlusCircleIcon, TagIcon, XIcon } from '@heroicons/react/outline'
import { checkUsername, createHelpRequest, createUser } from '@/services/ApiService';
import { useAuth } from '@/utils';
import { HelpRequestInit, OrganizationProfile, PersonCreate } from '@/declarations/api/api.did';
import { Loading, Notify } from 'notiflix';
import { number } from 'yup';
interface Props {
  open: boolean;
  setOpen: any;
  organization: OrganizationProfile;
}
export default function AddHelpRequstModal({ open, setOpen, organization }: Props) {
  const [currentHelpRequest, currentHelpRequestSet] = useState<HelpRequestInit>(
    {
      description: "",
      name: "",
      person: [],
      personId: [],
      tags: [],
      location: [],
      rewardAmount: BigInt(10),
      startDate: BigInt(10),
      startDateText: "",
      dueDate: BigInt(10),
      dueDateText: ""
    });
  const [loading, loadingSet] = useState(false);
  const [addPerson, addPersonSet] = useState(false);

  const [activePerson, activePersonSet] = useState<BigInt | null>(null);
  const [personNew, personNewSet] = useState<PersonCreate>({
    organizationId: organization.organziationId,
    address: "",
    age: BigInt(0),
    name: {
      first: "",
      last: "",
      middle: "",
      full: "",
    },
    location: [],
  });

  const onComplete = async () => {
    if (loading) {
      return;
    }
    loadingSet(true);
    Loading.standard("Saving Help Request...");

    if (addPerson) {
      currentHelpRequest.person = [personNew];
      currentHelpRequest.personId = []
    } else {
      currentHelpRequest.person = [];
      currentHelpRequest.personId[0] = activePerson! as bigint;
    }
    const res = await createHelpRequest(organization.organziationId, currentHelpRequest);
    if (res) {
      loadingSet(false);
      Loading.remove();
      setOpen(false, res);
    } else {
      Notify.failure('Could not save the help request.');
      Loading.remove();
    }


  }

  return (
    <Transition.Root<ExoticComponent> show={open} as={Fragment}>
      <Dialog<"div"> as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child<ExoticComponent>
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child<ExoticComponent>
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <KeyIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Add Help Request
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-5">
                        Enter the information below.
                      </p>
                    </div>
                  </div>
                </div>
                <div className=' '>
                  <div className="border-t border-gray-200  bg-gray-100 pt-5 px-5">
                    <div className=" grid grid-cols-6 gap-y-6 gap-x-4">
                      <div className="col-span-4">
                        <label htmlFor="request-name" className="block text-sm font-medium text-gray-700">
                          Request Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="request-name"
                            onChange={(evt) => currentHelpRequestSet({ ...currentHelpRequest, name: evt.target.value })}
                            value={currentHelpRequest.name}
                            name="request-name"
                            autoComplete="request-name"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="request-name" className="block text-sm font-medium text-gray-700">
                          Reward
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="reward-amount"
                            onChange={(evt) => currentHelpRequestSet({ ...currentHelpRequest, rewardAmount: BigInt(evt.target.value) })}
                            value={Number(currentHelpRequest.rewardAmount)}
                            name="request-name"
                            autoComplete="request-name"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label htmlFor="request-description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1">
                          <textarea
                            onChange={(evt) => currentHelpRequestSet({ ...currentHelpRequest, description: evt.target.value })}
                            value={currentHelpRequest.description}
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            name="request-description"
                            id="request-description"
                            placeholder="Description"
                          ></textarea>
                        </div>
                      </div>
                      {!addPerson && (
                        <>
                          <div className="col-span-4">
                            <label htmlFor="personId" className="block text-sm font-medium text-gray-700">
                              Person
                            </label>
                            <div className="mt-1">
                              <select
                                id="personId"
                                name="personId"
                                value={activePerson?.toString()}
                                onChange={(evt) => { activePersonSet(BigInt(evt.target.value)) }}

                                autoComplete="person-name"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value="null">Choose person ...</option>
                                {organization.persons.map(person => (
                                  <option key={person.personId.toString()} value={person.personId.toString()}>{person.name.first} {person.name.last}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                              Add Person
                            </label>
                            <div className="mt-1">
                              <button
                                onClick={() => { addPersonSet(true) }}
                                className='rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm'>Add Person</button>
                            </div>
                          </div>
                        </>
                      )}
                      {addPerson && (
                        <>
                          <div className="col-span-6 relative">
                            <h3>New Person <XIcon onClick={() => { addPersonSet(false) }} className="h-6 w-6 absolute right-0 cursor-pointer" aria-hidden="true" /></h3>
                            <div className='border-black  p-5'>

                              <div className='grid grid-cols-1 gap-y-6 gap-x-4'>
                                <div>
                                  <label htmlFor="first" className="block text-sm font-medium text-gray-700">
                                    First
                                  </label>

                                  <div className="mt-1">
                                    <input
                                      type="text"
                                      onChange={(evt) => personNewSet({ ...personNew, name: { ...personNew.name, first: evt.target.value } })}
                                      value={personNew.name.first}
                                      id="first name"
                                      name="first-name"
                                      autoComplete="first-name"
                                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label htmlFor="middle" className="block text-sm font-medium text-gray-700">
                                    Middle
                                  </label>

                                  <div className="mt-1">
                                    <input
                                      type="text"
                                      onChange={(evt) => personNewSet({ ...personNew, name: { ...personNew.name, middle: evt.target.value } })}
                                      value={personNew.name.middle}
                                      id="middle name"
                                      name="middle-name"
                                      autoComplete="middle-name"
                                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label htmlFor="last" className="block text-sm font-medium text-gray-700">
                                    Last
                                  </label>

                                  <div className="mt-1">
                                    <input
                                      type="text"
                                      onChange={(evt) => personNewSet({ ...personNew, name: { ...personNew.name, last: evt.target.value } })}
                                      value={personNew.name.last}
                                      id="last name"
                                      name="last-name"
                                      autoComplete="last-name"
                                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label htmlFor="address-name" className="block text-sm font-medium text-gray-700">
                                    Address
                                  </label>

                                  <div className="mt-1">
                                    <input
                                      type="text"
                                      onChange={(evt) => personNewSet({ ...personNew, address: evt.target.value })}
                                      value={personNew.address}
                                      id="address name"
                                      name="address-name"
                                      autoComplete="address-name"
                                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      <div className="col-span-3">
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                         Start Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="start-date"
                            onChange={(evt) => currentHelpRequestSet({ ...currentHelpRequest, startDateText: evt.target.value })}
                            value={currentHelpRequest.startDateText}
                            name="start-date"
                            autoComplete="start-date"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="col-span-3">
                        <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">
                         Due Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="due-date"
                            onChange={(evt) => currentHelpRequestSet({ ...currentHelpRequest, dueDateText: evt.target.value})}
                            value={currentHelpRequest.dueDateText}
                            name="due-date"
                            autoComplete="due-date"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="col-span-6 mb-10 mt-5">

                        <div className="mt-1 flex gap-6 mx-6">
                          <button className="hover:bg-blue-200 p-5  bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <PhoneIcon className='h-10 w-10' />  <PlusCircleIcon className='h-5 w-5' />
                          </button>
                          <button className="hover:bg-blue-200 p-5  bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <MapIcon className='h-10 w-10' />  <PlusCircleIcon className='h-5 w-5' />
                          </button>
                          <button className="hover:bg-blue-200 p-5  bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <TagIcon className='h-10 w-10' />  <PlusCircleIcon className='h-5 w-5' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse relative">
                  
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={onComplete}
                  >
                    Add Request
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <p className='absolute left-0 top-1'>Rewards: {currentHelpRequest.rewardAmount.toString()} Tokens</p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

