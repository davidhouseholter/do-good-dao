import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface API {
  'checkUsernameAvailable' : ActorMethod<[string], boolean>,
  'createHelpRequest' : ActorMethod<
    [OrganizationId, HelpRequestInit],
    [] | [HelpRequest],
  >,
  'createOrganization' : ActorMethod<
    [OrganizationCreate],
    [] | [OrganizationProfile],
  >,
  'createProfile' : ActorMethod<[UserProfile__1], [] | [UserProfileFull]>,
  'editOrganization' : ActorMethod<
    [OrganizationId, OrganizationEdit],
    [] | [boolean],
  >,
  'getFeedItems' : ActorMethod<[[] | [bigint]], [] | [Array<HelpRequest>]>,
  'getOrganizationProfile' : ActorMethod<
    [OrganizationId],
    [] | [OrganizationProfile],
  >,
  'getOrganizationPublic' : ActorMethod<
    [OrganizationId],
    [] | [OrganizationPublic],
  >,
  'getProfileFull' : ActorMethod<[], [] | [UserProfileFull]>,
  'getUserNameByPrincipal' : ActorMethod<[Principal], [] | [Array<UserId>]>,
  'getUserProfile' : ActorMethod<[UserId], [] | [UserProfile__1]>,
  'getUsersPublic' : ActorMethod<[[] | [bigint]], [] | [Array<UserProfile>]>,
  'whoami' : ActorMethod<[], Principal>,
}
export interface HelpRequest {
  'status' : HelpRequestStatus,
  'requestId' : HelpRequestId,
  'userId' : UserId__1,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'description' : string,
  'personId' : PersonId,
  'viewCount' : bigint,
  'location' : [] | [Location],
}
export type HelpRequestId = bigint;
export interface HelpRequestInit {
  'person' : [] | [PersonCreate],
  'name' : string,
  'tags' : Array<string>,
  'description' : string,
  'personId' : [] | [PersonId],
  'location' : [] | [Location],
}
export type HelpRequestStatus = { 'active' : null } |
  { 'confirmed' : null } |
  { 'accepted' : UserId__1 };
export interface Location { 'lat' : number, 'lng' : number }
export type LogoPic = Array<number>;
export interface OrganizationCreate {
  'userName' : string,
  'about' : string,
  'name' : string,
}
export interface OrganizationEdit {
  'userName' : string,
  'about' : string,
  'organziationId' : OrganizationId,
  'name' : string,
  'tags' : Array<string>,
  'logoPic' : [] | [LogoPic],
  'location' : [] | [Location],
}
export type OrganizationId = bigint;
export interface OrganizationProfile {
  'userName' : string,
  'about' : string,
  'organziationId' : OrganizationId,
  'userId' : UserId__1,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'persons' : Array<Person>,
  'logoPic' : [] | [LogoPic],
  'requests' : Array<HelpRequest>,
  'location' : [] | [Location],
}
export interface OrganizationPublic {
  'userName' : string,
  'about' : string,
  'organziationId' : OrganizationId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'logoPic' : [] | [LogoPic],
  'location' : [] | [Location],
}
export interface Person {
  'age' : bigint,
  'organizationId' : OrganizationId,
  'userId' : [] | [UserId__1],
  'name' : PersonName,
  'createdAt' : Timestamp,
  'personId' : PersonId,
  'address' : string,
  'location' : [] | [Location],
}
export interface PersonCreate {
  'age' : bigint,
  'organizationId' : OrganizationId,
  'name' : PersonName,
  'address' : string,
  'location' : [] | [Location],
}
export type PersonId = bigint;
export interface PersonName {
  'first' : string,
  'full' : string,
  'last' : string,
  'middle' : string,
}
export type Timestamp = bigint;
export type UserId = string;
export type UserId__1 = string;
export interface UserProfile { 'userName' : string }
export interface UserProfileFull {
  'userName' : string,
  'userId' : string,
  'rewards' : bigint,
  'organizations' : Array<OrganizationProfile>,
}
export interface UserProfile__1 { 'userName' : string }
export interface _SERVICE extends API {}
