
import { actorController } from "./ApiActor";
import { Principal } from "@dfinity/principal";
import { unwrap } from "@/utils";
import { Item, ItemInit, UserId, UserProfile, UserProfileFull } from "@/declarations/api/api.did";


const API = actorController;
export async function logoutAPI(){
  API.unauthenticateActor()
}
export async function getWhoAMI() : Promise<Principal> {
  const a = await (await API.actor).whoami();
  return a;
}
export async function getUserNameByPrincipal(principal: Principal) {
    const a = await (await API.actor).getUserNameByPrincipal(principal);
    const icUserName = unwrap<string>( a as any)!;
    return icUserName;
}
export async function getProfileFull(
    userId: string
  ): Promise<UserProfileFull | null> {
    console.log(userId)
    if(!userId) return null;
    const icUser = unwrap<UserProfileFull>(
      await (await API.actor).getProfileFull([userId], userId)
    );
    if (icUser) {
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
  ): Promise<UserProfileFull> {
    if (!principal) {
      throw Error("trying to create user without principal");
    }
    const profile = unwrap<UserProfileFull>(
      await (await API.actor).createProfile(userId)
    );
    if (profile) {
      return profile;
    } else {
      throw Error("failed to create profile: " + JSON.stringify(profile));
    }
  }

  export async function getFeedItems() : Promise<Item[]> {
    const a = await (await API.actor).getFeedItems([10n]);
    if(a == null) return [];
    return unwrap<any>( a as any);
  }
  
  export async function createHelpRequest(ItemInit: ItemInit): Promise<string> {
    const ItemId = unwrap<string>(
      await (await API.actor).createHelpRequest(ItemInit)
    );
    if (ItemId) {
      return ItemId;
    } else {
      throw Error("failed to create Item");
    }
  }

  export async function getUsersPublic(limit: bigint): Promise<UserProfile[]> {
    const a =  await (await API.actor).getUsersPublic([limit]);
    return unwrap<UserProfile[]>(
     a
    )!;
  }  export async function getUserProfile(userId: UserId): Promise<UserProfile> {
    const a =  await (await API.actor).getUserProfile(userId);
    console.log(a)
    return unwrap<UserProfile>(
     a
    )!;
  }