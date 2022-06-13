import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface API {
  'checkUsernameAvailable' : ActorMethod<[string], boolean>,
  'createHelpRequest' : ActorMethod<[HelpRequestInit], [] | [HelpRequestId]>,
  'createProfile' : ActorMethod<[string], [] | [UserProfileFull]>,
  'getFeedItems' : ActorMethod<[[] | [bigint]], [] | [Array<HelpRequest>]>,
  'getProfileFull' : ActorMethod<[Principal, UserId], [] | [UserProfileFull]>,
  'getUserNameByPrincipal' : ActorMethod<[Principal], [] | [Array<string>]>,
  'getUserProfile' : ActorMethod<[UserId], [] | [UserProfile__1]>,
  'getUsersPublic' : ActorMethod<[[] | [bigint]], [] | [Array<UserProfile>]>,
  'whoami' : ActorMethod<[], Principal>,
}
export interface HelpRequest {
  'status' : Status,
  'requestId' : HelpRequestId,
  'userId' : UserId__1,
  'name' : string,
  'createdAt' : Timestamp,
  'tags' : Array<string>,
  'viewCount' : bigint,
  'caption' : string,
  'location' : [] | [Location],
}
export type HelpRequestId = bigint;
export interface HelpRequestInit {
  'name' : string,
  'tags' : Array<string>,
  'caption' : string,
}
export interface Location { 'lat' : number, 'lng' : number }
export type Status = { 'active' : null } |
  { 'confirmed' : null } |
  { 'accepted' : UserId__1 };
export type Timestamp = bigint;
export type UserId = string;
export type UserId__1 = string;
export interface UserProfile { 'userName' : string }
export interface UserProfileFull { 'userName' : string, 'rewards' : bigint }
export interface UserProfile__1 { 'userName' : string }
export interface _SERVICE extends API {}
