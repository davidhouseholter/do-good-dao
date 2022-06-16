
import { actorController } from "./ApiActor";
import { Principal } from "@dfinity/principal";
import { unwrap } from "@/utils";
import { HelpRequest, HelpRequestId, HelpRequestInit, OrganizationCreate, OrganizationProfile, OrganizationPublic, UserId, UserProfile, UserProfileFull } from "@/declarations/api/api.did";


const API = actorController;
export async function logoutAPI() {
  API.unauthenticateActor()
}
export async function getWhoAMI(): Promise<Principal> {
  const a = await (await API.actor).whoami();
  return a;
}
export async function getUserNameByPrincipal(principal: Principal) {
  const a = await (await API.actor).getUserNameByPrincipal(principal);
  const icUserName = unwrap<string>(a as any)!;
  return icUserName;
}
export async function getProfileFull(
): Promise<UserProfileFull | null> {

  // if(!userId) return null;
  // console.log(userId)
  const icUser = unwrap<any>(
    await (await API.actor).getProfileFull()
  );
  if (icUser) {
    console.log(icUser);
    return icUser;
  } else {
    return null;
  }
}

export async function checkUsername(username: string): Promise<boolean> {
  const r = await (await API.actor).checkUsernameAvailable(username);
  return r;
}

export async function createUser(
  userId: string,
  principal?: Principal | null
): Promise<any> {
  if (!principal) {
    throw Error("trying to create user without principal");
  }
  
  const profile = unwrap<UserProfile>(
    await (await API.actor).createProfile({ userName: userId })
  );
  if (profile) {
    return profile;
  } else {
    throw Error("failed to create profile: " + JSON.stringify(profile));
  }
}

export async function getFeedItems(): Promise<HelpRequest[]> {
  const a = await (await API.actor).getFeedItems([10n]);
  console.log(a);
  if (a == null) return [];
  return unwrap<any>(a as any);
}

export async function createHelpRequest(orgId: bigint, requestInit: HelpRequestInit): Promise<HelpRequest> {
  const ItemId = unwrap<HelpRequest>(
    await (await API.actor).createHelpRequest(orgId, requestInit)
  );
  if (ItemId) {
    return ItemId;
  } else {
    throw Error("failed to create Item");
  }
}

export async function getUsersPublic(limit: bigint): Promise<UserProfile[]> {
  const a = await (await API.actor).getUsersPublic([limit]);
  return unwrap<UserProfile[]>(
    a
  )!;
}

export async function getUserProfile(userId: UserId): Promise<UserProfile> {
  const a = await (await API.actor).getUserProfile(userId);
  console.log(a)
  return unwrap<UserProfile>(
    a
  )!;
}

export async function createOrganization( orgData: OrganizationCreate): Promise<OrganizationProfile> {

  const profile = unwrap<OrganizationProfile>(
    await (await API.actor).createOrganization(orgData)
  );
  if (profile) {
    return profile;
  } else {
    throw Error("failed to create profile: " + JSON.stringify(profile));
  }
}

export async function getOrganizationPublic(orgId: bigint) {
  const a = await (await API.actor).getOrganizationPublic(orgId);
  return unwrap<OrganizationPublic>(
    a
  )
}

export async function getOrganizationProfile(orgId: bigint) {
  const a = await (await API.actor).getOrganizationProfile(orgId);
  return unwrap<OrganizationProfile>(
    a
  )
}
export async function editOrganization(
  userId: string,
  principal?: Principal | null
): Promise<any> {
  if (!principal) {
    throw Error("trying to create user without principal");
  }
  
  const profile = unwrap<UserProfile>(
    await (await API.actor).createProfile({ userName: userId })
  );
  if (profile) {
    return profile;
  } else {
    throw Error("failed to create profile: " + JSON.stringify(profile));
  }
}