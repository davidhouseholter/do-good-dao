/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState, Component, FormEvent, ExoticComponent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon, XIcon } from '@heroicons/react/outline'
import SelectUserName from '../user/SelectUsername'
import { checkUsername, createUser } from '@/services/ApiService';
import { useAuth } from '@/utils';

export default function UserSetup({open, setOpen}){
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [username, setUsername] = useState("");
  const auth = useAuth();
  const [error, setError] = useState("");
  const onComplete = async (params:any) => {
    setError("");
    setIsSigningIn(true);
    // Check to make sure this username has not been taken. If this user already
    // has a username, it should have signed them in already.
    const isAvailable = await checkUsername(username);

    if (isAvailable) {
      // Create a user on the backend and assign that user to frontend data.
      const user = await createUser(username, auth.identity?.getPrincipal());
      auth.setUser(user);
      setIsSigningIn(false);
      setOpen(false)
    //   navigate("/feed");
    } else {
      setError(`Username '${username}' is taken`);
      setIsSigningIn(false);
    }
  }


   // Submit the form to signup with a new username, the backend ensures that
  // the username is available.
  async function submit(evt: FormEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    setError("");

    
    setIsSigningIn(true);
    // Check to make sure this username has not been taken. If this user already
    // has a username, it should have signed them in already.
    const isAvailable = await checkUsername(username);

    if (isAvailable) {
      // Create a user on the backend and assign that user to frontend data.
      const user = await createUser(username, auth.identity?.getPrincipal());
      auth.setUser(user);
      setIsSigningIn(false);
      setOpen(false)
    //   navigate("/feed");
    } else {
      setError(`Username '${username}' is taken`);
      setIsSigningIn(false);
    }
  }
  return (
    <Transition.Root<ExoticComponent> show={open} as={Fragment}>
      <Dialog<"div">  as="div" className="relative z-10" onClose={setOpen}>
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
                    onClick={() => setOpen(false) }
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Choose Username
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You must first create a username.
                      </p>
                    </div>
                    
                  </div>
                </div>
                <SelectUserName error={error} username={username} setUsername={setUsername}  />
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={onComplete}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

