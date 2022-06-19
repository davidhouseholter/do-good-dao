import { useState } from "react";
import OrganizationSetup from "../organization/OrganizationSetup";
import { updateUserProfile } from "@/services/ApiService";
import { UserProfile, UserProfileFull } from "@/declarations/api/api.did";
import { useAuth } from "@/utils";
import { FlagIcon, MapIcon, PhoneIcon, PlusCircleIcon, TagIcon } from "@heroicons/react/outline";
import { useAppState } from "@/utils/AppState";
import { Loading, Notify } from "notiflix";


interface Props {
  setEditMode?: any;
  setOpen: any;
}
export default function SelectAccountType({ setEditMode, setOpen }: Props) {
  const { user } = useAuth();
  const { fetchFeed } = useAppState();
  const [activeType, activeTypeSet] = useState<number | null>();
  const [data, dataSet] = useState<any>({
    first: "",
    middle: "",
    last: "",
    location: []
  });
  const selectType = (type: number) => {
    activeTypeSet(type);
    if (setEditMode) {
      setEditMode(true)
    }
  }
  const onSaveHelper = async () => {
    if (user == null) {
      return;
    }
    Loading.standard("Saving Profile...");
    const d: UserProfile = {
      userName: user.userName,
      address: "",
      location: [],
      name: [{
        first: data.first,
        middle: data.middle,
        last: data.last,
        full: `${data.first} ${data.middle} ${data.last}`,
      }]
    };

    let res = await updateUserProfile(user.userId, d);

    if (res) {
      await fetchFeed();
      setOpen(false);
      Loading.remove();
    } else {
      Notify.failure('Could not save profile');
      Loading.remove();
    }
  };
  return (
    <>
      {activeType == null && (
        <div className="mt-5 cursor-pointer rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
          <div
            onClick={() => { selectType(1); }}
            className="relative group bg-white p-6 focus-within:ring-2 hover:bg-gray-200 	cursor:pointer; focus-within:ring-inset focus-within:ring-indigo-500"
          >
            Setup Non Profit
          </div>
          <div
            onClick={() => { selectType(2); }}
            className="relative group bg-white p-6 focus-within:ring-2 hover:bg-gray-200 	cursor:pointer; focus-within:ring-inset focus-within:ring-indigo-500"
          >
            Just a Helper
          </div>
        </div>
      )}

      {activeType == 1 && (

        <>
          <div className="border-t border-gray-200  bg-gray-100 pt-5 px-5 mt-5">
            <OrganizationSetup setOpen={setOpen} />
          </div>

        </>
      )}

      {activeType == 2 && (

        <>
          <div className='mt-5'>
            <div className="border-t border-gray-200  bg-gray-100 pt-5 px-5">



              <div className="grid grid-cols-6 gap-y-6 gap-x-4">

                <div className="col-span-6">
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      onChange={(evt) => dataSet({ ...data, first: evt.target.value })}
                      value={data.first}
                      name="request-name"
                      autoComplete="first-name"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-6">
                  <label htmlFor="middle-name" className="block text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="middle-name"
                      onChange={(evt) => dataSet({ ...data, middle: evt.target.value })}
                      value={data.middle}
                      name="middle-name"
                      autoComplete="middle-name"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-6">
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      onChange={(evt) => dataSet({ ...data, last: evt.target.value })}
                      value={data.last}
                      name="last-name"
                      autoComplete="last-name"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>


                <div className="col-span-6 mb-10">

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
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onSaveHelper}
            >
              Save Profile
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </>
  )
}