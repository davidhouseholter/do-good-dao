import { Fragment, useState, ExoticComponent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon, UserIcon, XIcon } from '@heroicons/react/outline'
import SelectUserName from '../user/SelectUsername'
import { checkUsername, createUser } from '@/services/ApiService';
import { useAuth } from '@/utils';
import SelectAccountType from '../user/AccountSetup';
import { useAppState } from '@/utils/AppState';

export default function UserSetupAccount({ open, setOpen }) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { setHasCheckedAccountSetup } = useAppState();
  const [editMode, setEditMode] = useState("");

  const auth = useAuth();
  const [error, setError] = useState("");
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
                    onClick={() => { setHasCheckedAccountSetup(true); setOpen(false); }}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                     
                      {!editMode && (<>
                        Setup Account
                      </>) }
                      {editMode && (<>
                        Finish Setup
                      </>) }
                    </Dialog.Title>
                    <div className="mt-2">
                      {!editMode && (<>
                        <p className="text-sm text-gray-500">
                        Before you can use the application you must finish the account setup. You are
                        free to browse the site by skipping this step.
                      </p>
                      </>) }
                    </div>

                  </div>
                </div>

                <SelectAccountType setEditMode={setEditMode} setOpen={setOpen} />

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  {!editMode && (
                    <>
                      <button
                        type="button"
                        className="mt-3 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => { setHasCheckedAccountSetup(true); setOpen(false) }}
                      >
                        Maybe Later
                      </button>

                      {/* <div className="flex justify-center">
                        <div className="form-check mt-2 mr-10">
                          <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" />
                          <label className="form-check-label inline-block text-gray-800" >
                            Remember
                          </label>
                        </div>
                      </div> */}
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

