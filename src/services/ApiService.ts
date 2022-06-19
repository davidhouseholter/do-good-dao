
import { actorController } from "./ApiActor";
import { Principal } from "@dfinity/principal";
import { unwrap } from "@/utils";
import { HelpRequest, HelpRequestId, HelpRequestInit, HelpRequestViewPublic, OrganizationCreate, OrganizationEdit, OrganizationProfile, OrganizationPublic, UserId, UserProfile, UserProfileFull } from "@/declarations/api/api.did";
import { bool } from "yup";


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
  const icUser = unwrap<UserProfileFull>(
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

  const profile = unwrap<UserProfileFull>(
    await (await API.actor).createProfile({ userName: userId, address:"", location:[], name:[] })
  );
  if (profile) {
    return profile;
  } else {
    throw Error("failed to create profile: " + JSON.stringify(profile));
  }
}

export async function getFeedItems(): Promise<HelpRequestViewPublic[]> {
  const a = await (await API.actor).getFeedItems([100n]);
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

export async function updateUserProfile(userId: UserId, userData: UserProfile): Promise<boolean> {
  const a = await (await API.actor).updateUserProfile(userId, userData);
  console.log(a)
  return unwrap<boolean>(
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
 orgId: bigint,
 orgData: OrganizationEdit
): Promise<any> {

  const profile = unwrap<boolean>(
    await (await API.actor).editOrganization(orgId, orgData)
  );
  console.log(profile)
  if (profile) {
    return profile;
  } else {
    throw Error("failed to create profile: " + JSON.stringify(profile));
  }
}

export async function applyForHelpRequest(requestId: HelpRequestId) {
  const a = await (await API.actor).applyForHelpRequest(requestId);
  return unwrap<boolean>(
    a
  )
}

export async function acceptHelperRequest(requestId: bigint, userId: string) {
  const a = await (await API.actor).acceptHelperRequest(requestId, userId);
  return unwrap<boolean>(
    a
  )
}

export async function completeHelperRequest(requestId: HelpRequestId) {
  const a = await (await API.actor).completeHelperRequest(requestId);
  return unwrap<boolean>(
    a
  )
}

export async function acceptCompleteHelperRequest(requestId: HelpRequestId, userId: string) {
  const a = await (await API.actor).acceptCompleteHelperRequest(requestId, userId);
  return unwrap<boolean>(
    a
  )
}