// getLocation() {
//     return new Promise((yay, nay) => {
//       navigator.geolocation.getCurrentPosition((location) => {
//         console.log({ location });
//         // TODO: Handle user rejection
//         const { latitude, longitude } = location.coords;
//         location =
//           latitude !== null && longitude !== null
//             ? { lat: latitude, lng: longitude }
//             : default_location;
//         this.state.me.user.forEach((user) => (user.location = location));
//         this.state.me.helper.forEach((user) => (user.location = location));
//         this.state.location = location;
//         yay();
//       });
//     });

import { HelpRequestViewPublic, Helper} from "@/declarations/api/api.did";
import { HelpRequest_ } from "@/utils";
import { HelpRequestViewPublic_, useAppState } from "@/utils/AppState";
import { MailIcon, CheckCircleIcon, ChevronRightIcon, DotsCircleHorizontalIcon, HandIcon, OfficeBuildingIcon } from "@heroicons/react/outline";
import { UserCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HelpRequstDetalsModal from "../requests/HelpRequestDetailsModal";
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
//   }
export const Map = () => {
  const default_location = { lat: 45.676998, lng: -111.042931 };
  const default_location2 = { lat: 47.606209, lng: -122.332069 };
  const { currentItems, setCurrentItems } = useAppState();
  const navigate = useNavigate();
  const [showDetailsModal, showDetailsModalSet] = useState(false);
  const requestModalNext = (show : boolean, type: string) => {
    if(!activeRequest) return;
    if(type == 'request') {
      if(!activeRequest.approvedHelper[0]) {
        let aNew :Helper  = {
          acceptComplete: false,
          userId: "",
          createdAt: 0n,
          complete: false,
          updatedAt: 0n,
          approved: false
        };
        activeRequest.approvedHelper[0] = aNew;
      } 
    }
    if(type == 'complete') {
      if(activeRequest.approvedHelper[0]) {
        activeRequest.approvedHelper[0].complete = true;
      } 
    }
    showDetailsModalSet(show);
  }
  const [activeRequest, activeRequestSet] = useState<HelpRequestViewPublic_ | null>(null);
  return (
    <>
      {showDetailsModal && (
        <HelpRequstDetalsModal setOpen={requestModalNext} open={showDetailsModal} request={activeRequest!} />
      )}
      {currentItems?.length > 0 && (<div className="bg-white shadow overflow-hidden sm:rounded-md mt-5">
        <ul role="list" className="divide-y divide-gray-200">
          {currentItems.reverse().map((item) => (
            <li key={item.requestId.toString()} className="hover:bg-blue-200 hover:cursor-pointer">
              <a onClick={() => {
                activeRequestSet(item); showDetailsModalSet(true);
              }} className="block hover:bg-gray-50">
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      {/* <img className="h-12 w-12 rounded-full" src={item.applicant.imageUrl} alt="" /> */}
                    </div>
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="text-sm font-medium text-indigo-600 truncate">{item.name}</p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          {item.description}
                        </p>
                        <p className="flex mt-2"><OfficeBuildingIcon className="h-4 w-4" /> <span  className="text-sm font-medium truncate">{item.organization.name}</span></p>
                        <p>
                        {getDateText(item as any)}

                        </p>
                      </div>
                      {/* <div className="hidden md:block"> */}

                      <div className="md:block">
                        <div>

                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <span className='flex p-2 mt-2'  >
                              {(!(item.approvedHelper[0])) && (<DotsCircleHorizontalIcon  className='h-5 w-5 ' />)}
                              {item.approvedHelper[0] && (!item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (<HandIcon  className='h-5 w-5 ' />)}
                              {(item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete) && (<HandIcon className=' h-5 w-5 text-yellow-600' />)}
                              {(item.approvedHelper[0]?.approved && item.approvedHelper[0]?.complete) && (<HandIcon className=' h-5 w-5 text-green-600' />)}
                            </span>
                            <p className="mt-1">
                              {!(item.approvedHelper[0]) && (
                                <>Open</>
                              )}
                              {item.approvedHelper[0] && (!item.approvedHelper[0]?.approved && !item.approvedHelper[0]?.complete)  &&(
                                <>Requested</>
                              )}
                             {item.approvedHelper[0]?.complete && (
                                    <>
                                    {!item.approvedHelper[0]?.acceptComplete && <>{"In Review"}</>} 
                                    {item.approvedHelper[0]?.acceptComplete && <>{"Accepted"}</>} 

                                    </>
                                  )}
                            </p> 
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>)}
      {/* {currentItems?.length > 0 && (
        currentItems.map(item => (
          <div key={`${item.requestId}`} onClick={() => {
            activeRequestSet(item); showDetailsModalSet(true);
          }}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className='flex '>
              <span className='mr-2'>Username: </span>
              <a onClick={() => {
                navigate(`/users/${item.userId}`)
              }}
              >{item.userId}</a>
            </p>
          </div>
        ))
      )} */}
    </>
  )
}
