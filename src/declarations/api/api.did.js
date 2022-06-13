export const idlFactory = ({ IDL }) => {
  const HelpRequestInit = IDL.Record({
    'name' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'caption' : IDL.Text,
  });
  const HelpRequestId = IDL.Nat;
  const UserProfileFull = IDL.Record({
    'userName' : IDL.Text,
    'rewards' : IDL.Nat,
  });
  const UserId__1 = IDL.Text;
  const Status = IDL.Variant({
    'active' : IDL.Null,
    'confirmed' : IDL.Null,
    'accepted' : UserId__1,
  });
  const Timestamp = IDL.Int;
  const Location = IDL.Record({ 'lat' : IDL.Float64, 'lng' : IDL.Float64 });
  const HelpRequest = IDL.Record({
    'status' : Status,
    'requestId' : HelpRequestId,
    'userId' : UserId__1,
    'name' : IDL.Text,
    'createdAt' : Timestamp,
    'tags' : IDL.Vec(IDL.Text),
    'viewCount' : IDL.Nat,
    'caption' : IDL.Text,
    'location' : IDL.Opt(Location),
  });
  const UserId = IDL.Text;
  const UserProfile__1 = IDL.Record({ 'userName' : IDL.Text });
  const UserProfile = IDL.Record({ 'userName' : IDL.Text });
  const API = IDL.Service({
    'checkUsernameAvailable' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'createHelpRequest' : IDL.Func(
        [HelpRequestInit],
        [IDL.Opt(HelpRequestId)],
        [],
      ),
    'createProfile' : IDL.Func([IDL.Text], [IDL.Opt(UserProfileFull)], []),
    'getFeedItems' : IDL.Func(
        [IDL.Opt(IDL.Nat)],
        [IDL.Opt(IDL.Vec(HelpRequest))],
        ['query'],
      ),
    'getProfileFull' : IDL.Func(
        [IDL.Principal, UserId],
        [IDL.Opt(UserProfileFull)],
        ['query'],
      ),
    'getUserNameByPrincipal' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(IDL.Text))],
        [],
      ),
    'getUserProfile' : IDL.Func([UserId], [IDL.Opt(UserProfile__1)], ['query']),
    'getUsersPublic' : IDL.Func(
        [IDL.Opt(IDL.Nat)],
        [IDL.Opt(IDL.Vec(UserProfile))],
        ['query'],
      ),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return API;
};
export const init = ({ IDL }) => { return []; };
