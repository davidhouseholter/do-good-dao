import { Fragment, useState, ExoticComponent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckCircleIcon, DotsCircleHorizontalIcon, KeyIcon, XIcon } from '@heroicons/react/outline'
import { acceptCompleteHelperRequest, acceptHelperRequest, applyForHelpRequest, checkUsername, createHelpRequest, createUser } from '@/services/ApiService';
import { HelpRequest_, useAuth } from '@/utils';
import { Helper, HelpRequestViewPublic, Person } from '@/declarations/api/api.did';
import HelpRequstDetal from './HelpRequestDetail';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading, Notify } from 'notiflix';
import { HelpRequestViewPublic_ } from '@/utils/AppState';

interface Props {
  open: boolean;
  setOpen: any;
  request: HelpRequest_;
}
export default function OwnerHelpRequstDetalsModal({ open, setOpen, request }: Props) {
  const [loading, loadingSet] = useState(false);
  const onAcceptHelper = async (helper: Helper) => {
    if(loading) return;
    loadingSet(true);
    Loading.standard("Saving...");
    let res = await acceptHelperRequest(request.requestId, helper.userId);
    if (res) {
      setOpen(false, 'approve', helper.userId);
      Notify.success('Approved');
      Loading.remove();
      
    } else {
      Notify.failure('Can not save request.');
    }
    loadingSet(false);
  }
 
  const onAcceptComplete = async (helper: Helper) => {
    if(loading) return;
    loadingSet(true);
    Loading.standard("Saving...");
    let res = await acceptCompleteHelperRequest(request.requestId, helper.userId);
    if (res) {
      setOpen(false, 'complete', helper.userId);
      Notify.success('Approved');
      Loading.remove();
    } else {
      Notify.failure('Can not save request.');
    }
    loadingSet(false);
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
                <main>

                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Helpers</h3>
                    <div className="mt-5">

                      {request.helpers.map(helper => (
                        <div key={helper.userId} className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                          <h4 className="sr-only">{helper.userId}</h4>
                          <div className="sm:flex sm:items-start">

                            <div>
                              <img
                                className="h-8 w-8 rounded-full"
                                src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                                alt=""
                              />
                              <span className='flex p-2 mt-2'  >
                                {(!helper.approved && !helper.complete) && (<DotsCircleHorizontalIcon className='h-5 w-5 ' />)}
                                {(helper.approved && !helper.complete) && (<CheckCircleIcon className=' h-5 w-5 text-yellow-600' />)}
                                {(helper.approved && helper.complete) && (<CheckCircleIcon className=' h-5 w-5 text-green-600' />)}
                              </span>
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {helper.userId}
                              </div>


                              <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                                <div>
                                  {(helper.approved && !helper.complete) && (
                                    <>
                                      Waiting for Help to be completed.
                                    </>
                                  )}
                                </div>
                                <span className="hidden sm:mx-2 sm:inline" aria-hidden="true">
                                  &middot;
                                </span>
                                <div className="mt-1 sm:mt-0">Last updated on {helper.updatedAt.toString()}</div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                       
                            {(!helper.approved && !helper.complete) && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onAcceptHelper(helper)
                                  }}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                >
                                  Approve
                                </button>
                              </>
                            )}
                            {(helper.approved && helper.complete && !helper.acceptComplete) && (
                              <>
                                <button
                                  disabled={!helper.complete}
                                  type="button"
                                  onClick={() => {
                                    onAcceptComplete(helper);
                                  }}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                >
                                  Complete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </main>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">


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

