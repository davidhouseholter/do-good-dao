import { OrganizationCreate } from "@/declarations/api/api.did";
import { createOrganization } from "@/services/ApiService";
import { useAuth } from "@/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// class OrganziationCreate {
//     name: string = "";
//     about: string = "";
//     // logoPic : LogoPic;
// }
export default function OrganizationSetup({setOpen}) {

    const [org, setOrg] = useState<OrganizationCreate>({
        about:"",
        name: "",
        userName: ""
    });

    const { addOrganization }= useAuth();

    const navigate = useNavigate();

    const onCreateOrg = async () => {
        const newOrg = await createOrganization(org);
        setOpen(false);
        console.log(newOrg);   
        addOrganization(newOrg) 
        setTimeout(() => {
            navigate(`/organization/${newOrg.organziationId}`)
        }, 300);
    }

    
    return (
        <>
            <h2>Setup Non Profit</h2>
            <div>
                <form className="mt-5 sm:flex sm:items-center">
                    <div className="w-full sm:max-w-xs">
                        <input
                            onChange={(evt) => setOrg({ ...org, name: evt.target.value })}
                            value={org.name}
                            type="text"
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            name="name"
                            id="name"
                            placeholder="name"
                        />
                    </div>
                    <div className="w-full sm:max-w-xs">
                        <textarea
                            onChange={(evt) => setOrg({ ...org, about: evt.target.value })}
                            value={org.about}
                            className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            name="about"
                            id="about"
                            placeholder="about"
                        ></textarea>
                    </div>
                </form>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    onClick={onCreateOrg}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-green-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                    Create
                </button>
            </div>


            <ul>
                <li>
                    Add:
                </li>
                <li>Username</li>
                <li>Tags</li>
                <li>Location</li>
                <li>Logo?</li>

            </ul>
        </>
    )
}