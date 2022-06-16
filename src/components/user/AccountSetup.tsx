import { useState } from "react";
import OrganizationSetup from "../organization/OrganizationSetup";



interface Props {
    setEditMode?: any;
    setOpen: any;
}
export default function SelectAccountType({ setEditMode, setOpen }: Props) {

    const [showOrganizationSetup, setOrganizationSetup] = useState<any>();
    const selectType = (type: number) => {
        switch (type) {
            case 1:
                setOrganizationSetup(true);
                if (setEditMode) {
                    setEditMode(true)
                }
                break;
            case 2:
                break;
        }
    }
    return (
        <>
            {!showOrganizationSetup && (
                <div className="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
                    <div
                        onClick={() => { selectType(1); }}
                        className="relative group bg-white p-6 focus-within:ring-2 hover:bg-gray-200 	cursor:pointer; focus-within:ring-inset focus-within:ring-indigo-500"
                    >
                        Setup Non Profit
                    </div>
                    <div
                        className="relative group bg-white p-6 focus-within:ring-2 hover:bg-gray-200 	cursor:pointer; focus-within:ring-inset focus-within:ring-indigo-500"
                    >
                        Be a Helper
                    </div>
                </div>
            )}
            {showOrganizationSetup && (

                <>
                    <OrganizationSetup setOpen={setOpen} />
                </>
            )}
        </>
    )
}