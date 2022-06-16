import OrganizationEdit from "./OrganizationEdit";

export default function OrganizationSettings({user, org}) {
    return (
        <>
           <OrganizationEdit user={user} org={org}/>
        </>
    )
}