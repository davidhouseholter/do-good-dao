import { OrganizationCreate } from "@/declarations/api/api.did";
import { createOrganization } from "@/services/ApiService";
import { useAuth } from "@/utils";
import { Loading } from "notiflix";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// class OrganziationCreate {
//     name: string = "";
//     about: string = "";
//     // logoPic : LogoPic;
// }
export default function OrganizationSetup({ setOpen }) {

    const [org, setOrg] = useState<any>({
        about: "",
        name: "",
        userName: ""
    });

    const { addOrganization } = useAuth();

    const navigate = useNavigate();

    const onCreateOrg = async () => {
        Loading.standard("Saving Organiztion...")
        const newOrg = await createOrganization(org);
        if(newOrg) {
               setOpen(false);
        addOrganization(newOrg)
        setTimeout(() => {
            navigate(`/organization/${newOrg.organziationId}`);
            Loading.remove();
        }, 300);
        } else {
            Loading.remove();
        }
     
    }


    return (
        <>
            <div>
                <form className="">
                    <div className="">
                        <div className="w-full ">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Name</label>
                        </div>
                        <div className="w-full">
                            <input
                                onChange={(evt) => setOrg({ ...org, name: evt.target.value })}
                                value={org.name}
                                type="text"
                                className="shadow-sm   w-full  rounded-md"
                                name="name"
                                id="name"
                                placeholder="name"
                            />
                        </div>
                    </div>
                    <div className="my-2">
                        <div className="w-full ">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Location</label>
                        </div>
                        <div className="w-full">
                            <input
                                onChange={(evt) => setOrg({ ...org, location: evt.target.value })}
                                value={org.location}
                                type="text"
                                className="shadow-sm   w-full  rounded-md"
                                name="location"
                                id="location"
                                placeholder="location"
                            />
                        </div>
                    </div>
                </form>
            </div>
            <div className=" py-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    onClick={onCreateOrg}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-green-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                    Create
                </button>
            </div>

{/* 
            <ul>
                <li>
                    Add:
                </li>
                <li>Username</li>
                <li>Tags</li>
                <li>Location</li>
                <li>Logo?</li>

            </ul> */}
        </>
    )
}