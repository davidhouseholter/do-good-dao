import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface API {
  'acceptCompleteHelperRequest' : ActorMethod<
    [HelpRequestId, UserId],
    [] | [boolean],
  >,
  'acceptHelperRequest' : ActorMethod<[HelpRequestId, UserId], [] | [boolean]>,
  'applyForHelpRequest' : ActorMethod<[HelpRequestId], [] | [boolean]>,
  'checkUsernameAvailable' : ActorMethod<[string], boolean>,
  'completeHelperRequest' : ActorMethod<[HelpRequestId], [] | [boolean]>,
  'createHelpRequest' : ActorMethod<
    [OrganizationId, HelpRequestInit],
    [] | [HelpRequest],
  >,
  'createOrganization' : ActorMethod<
    [OrganizationCreate],
    [] | [OrganizationProfile],
  >,
  'createProfile' : ActorMethod<[UserProfile], [] | [UserProfileFull]>,
  'editOrganization' : ActorMethod<
    [OrganizationId, OrganizationEdit],
    [] | [boolean],
  >,
  'getFeedItems' : ActorMethod<
    [[] | [bigint]],
    [] | [Array<HelpRequestViewPublic>],
  >,
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
  'getUserProfile' : ActorMethod<[UserId], [] | [UserProfile]>,
  'getUsersPublic' : ActorMethod<[[] | [bigint]], [] | [Array<UserProfile>]>,
  'updateUserProfile' : ActorMethod<[UserId, UserProfile], [] | [boolean]>,
  'whoami' : ActorMethod<[], Principal>,
}
export interface HelpRequest {
  'status' : HelpRequestStatus,
  'organizationId' : OrganizationId,
  'approvedHelper' : [] | [Helper],
  'requestId' : HelpRequestId,
  'dueDateText' : string,
  'rewardAmount' : bigint,
  'userId' : UserId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'dueDate' : Timestamp,
  'description' : string,
  'personId' : PersonId,
  'viewCount' : bigint,
  'helpers' : Array<Helper>,
  'startDateText' : string,
  'location' : [] | [Location],
  'startDate' : Timestamp,
}
export type HelpRequestId = bigint;
export interface HelpRequestInit {
  'dueDateText' : string,
  'rewardAmount' : bigint,
  'person' : [] | [PersonCreate],
  'name' : string,
  'tags' : Array<string>,
  'dueDate' : Timestamp,
  'description' : string,
  'personId' : [] | [PersonId],
  'startDateText' : string,
  'location' : [] | [Location],
  'startDate' : Timestamp,
}
export type HelpRequestStatus = { 'active' : null } |
  { 'completed' : null } |
  { 'approved' : null } |
  { 'inProgress' : null };
export interface HelpRequestViewPublic {
  'status' : HelpRequestStatus,
  'organizationId' : OrganizationId,
  'approvedHelper' : [] | [Helper],
  'requestId' : HelpRequestId,
  'dueDateText' : string,
  'rewardAmount' : bigint,
  'userId' : UserId,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'dueDate' : Timestamp,
  'description' : string,
  'organization' : OrganizationPublic,
  'startDateText' : string,
  'location' : [] | [Location],
  'startDate' : Timestamp,
}
export interface Helper {
  'acceptComplete' : boolean,
  'userId' : UserId,
  'createdAt' : Timestamp,
  'complete' : boolean,
  'updatedAt' : Timestamp,
  'approved' : boolean,
}
export interface HelperRequestNotifictions {
  'organizationId' : OrganizationId,
  'requestId' : HelpRequestId,
  'userId' : [] | [UserId],
  'createdAt' : Timestamp,
  'read' : boolean,
  'updatedAt' : Timestamp,
  'message' : string,
}
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
  'userId' : UserId,
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
  'userId' : [] | [UserId],
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
export interface UserProfile {
  'userName' : string,
  'name' : [] | [PersonName],
  'address' : string,
  'location' : [] | [Location],
}
export interface UserProfileFull {
  'userName' : string,
  'helpRequestsNotifications' : Array<HelperRequestNotifictions>,
  'userId' : string,
  'name' : [] | [PersonName],
  'helpRequests' : Array<HelpRequestViewPublic>,
  'address' : string,
  'rewards' : bigint,
  'location' : [] | [Location],
  'organizations' : Array<OrganizationProfile>,
}
export interface _SERVICE extends API {}
