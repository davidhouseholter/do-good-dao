import { Fragment, useState, ExoticComponent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { KeyIcon, XIcon } from '@heroicons/react/outline'
import { applyForHelpRequest, checkUsername, completeHelperRequest, createHelpRequest, createUser } from '@/services/ApiService';
import { useAuth } from '@/utils';
import { HelpRequestViewPublic } from '@/declarations/api/api.did';
import HelpRequstDetal from './HelpRequestDetail';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading, Notify } from 'notiflix';
import { HelpRequestViewPublic_ } from '@/utils/AppState';

interface Props {
  open: boolean;
  setOpen: any;
  request?: HelpRequestViewPublic_;
}
export default function HelpRequstDetalsModal({ open, setOpen, request }: Props) {
  const [loading, loadingSet] = useState(false);

  const requestToHelp = async () => {
    if(loading) return;
    loadingSet(true);
    Loading.standard("Saving....")
    Confirm.show(
      'Confirm', 'Do you want to request?',
      'Yes','No',
      async () => {
        let res = await applyForHelpRequest(request?.requestId!);
        if (res) {
          Loading.remove();
          Notify.success('Thank You');
          setOpen(false, 'request');
        } else {
          Notify.failure('Can not save request.');
        } loadingSet(false);
      },  () => { Loading.remove();},{ },
    );
  };
  const completeRequestToHelp = () => {
    if(loading) return;
    loadingSet(true);
    Loading.standard("Saving....")
    Confirm.show(
      'Confirm', 'Do you want to complete this request?',
      'Yes','No',
      async () => {
        let res = await completeHelperRequest(request?.requestId!);
        console.log(res);
        if (res) {
          Loading.remove();
          Notify.success('Thank You');
          setOpen(false, 'complete');
        }
        else {
          Notify.failure('Can not save request.');
        }loadingSet(false);
      },  () => { },{ },
    );
  };
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

                <div className='mt-5'>
                  {request && (
                    <HelpRequstDetal request={request} />
                  )}
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  {request?.approvedHelper[0] && !request?.approvedHelper[0]?.approved && !request?.approvedHelper[0]?.complete && (
                    <>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => {
                          Confirm.show( 'Not Supported', 'Check back later for support.',
                            'Yes',  'No',  async () => { }, () => {},{},);
                        }} >
                        Cancel Request
                      </button>
                    </>

                  )}
                  {!request?.approvedHelper[0] && !request?.approvedHelper[0]?.approved && !request?.approvedHelper[0]?.complete && (
                    <>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={requestToHelp}
                      >
                        Request To Help
                      </button>
                    </>
                  )}
                   {request?.approvedHelper[0] && request?.approvedHelper[0]?.approved && !request?.approvedHelper[0]?.complete && (
                    <>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={completeRequestToHelp}
                      >
                        Complete
                      </button>
                    </>
                  )}
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
    </Transition.Root >
  )
}

