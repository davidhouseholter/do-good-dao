export const idlFactory = ({ IDL }) => {
  const OrganizationId = IDL.Nat;
  const PersonName = IDL.Record({
    'first' : IDL.Text,
    'full' : IDL.Text,
    'last' : IDL.Text,
    'middle' : IDL.Text,
  });
  const Location = IDL.Record({ 'lat' : IDL.Float64, 'lng' : IDL.Float64 });
  const PersonCreate = IDL.Record({
    'age' : IDL.Nat,
    'organizationId' : OrganizationId,
    'name' : PersonName,
    'address' : IDL.Text,
    'location' : IDL.Opt(Location),
  });
  const PersonId = IDL.Nat;
  const HelpRequestInit = IDL.Record({
    'person' : IDL.Opt(PersonCreate),
    'name' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'personId' : IDL.Opt(PersonId),
    'location' : IDL.Opt(Location),
  });
  const UserId__1 = IDL.Text;
  const HelpRequestStatus = IDL.Variant({
    'active' : IDL.Null,
    'confirmed' : IDL.Null,
    'accepted' : UserId__1,
  });
  const HelpRequestId = IDL.Nat;
  const Timestamp = IDL.Int;
  const HelpRequest = IDL.Record({
    'status' : HelpRequestStatus,
    'requestId' : HelpRequestId,
    'userId' : UserId__1,
    'name' : IDL.Text,
    'createdAt' : Timestamp,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'personId' : PersonId,
    'viewCount' : IDL.Nat,
    'location' : IDL.Opt(Location),
  });
  const OrganizationCreate = IDL.Record({
    'userName' : IDL.Text,
    'about' : IDL.Text,
    'name' : IDL.Text,
  });
  const Person = IDL.Record({
    'age' : IDL.Nat,
    'organizationId' : OrganizationId,
    'userId' : IDL.Opt(UserId__1),
    'name' : PersonName,
    'createdAt' : Timestamp,
    'personId' : PersonId,
    'address' : IDL.Text,
    'location' : IDL.Opt(Location),
  });
  const LogoPic = IDL.Vec(IDL.Nat8);
  const OrganizationProfile = IDL.Record({
    'userName' : IDL.Text,
    'about' : IDL.Text,
    'organziationId' : OrganizationId,
    'userId' : UserId__1,
    'name' : IDL.Text,
    'createdAt' : Timestamp,
    'tags' : IDL.Vec(IDL.Text),
    'persons' : IDL.Vec(Person),
    'logoPic' : IDL.Opt(LogoPic),
    'requests' : IDL.Vec(HelpRequest),
    'location' : IDL.Opt(Location),
  });
  const UserProfile__1 = IDL.Record({ 'userName' : IDL.Text });
  const UserProfileFull = IDL.Record({
    'userName' : IDL.Text,
    'userId' : IDL.Text,
    'rewards' : IDL.Nat,
    'organizations' : IDL.Vec(OrganizationProfile),
  });
  const OrganizationEdit = IDL.Record({
    'userName' : IDL.Text,
    'about' : IDL.Text,
    'organziationId' : OrganizationId,
    'name' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'logoPic' : IDL.Opt(LogoPic),
    'location' : IDL.Opt(Location),
  });
  const OrganizationPublic = IDL.Record({
    'userName' : IDL.Text,
    'about' : IDL.Text,
    'organziationId' : OrganizationId,
    'name' : IDL.Text,
    'createdAt' : Timestamp,
    'tags' : IDL.Vec(IDL.Text),
    'logoPic' : IDL.Opt(LogoPic),
    'location' : IDL.Opt(Location),
  });
  const UserId = IDL.Text;
  const UserProfile = IDL.Record({ 'userName' : IDL.Text });
  const API = IDL.Service({
    'checkUsernameAvailable' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'createHelpRequest' : IDL.Func(
        [OrganizationId, HelpRequestInit],
        [IDL.Opt(HelpRequest)],
        [],
      ),
    'createOrganization' : IDL.Func(
        [OrganizationCreate],
        [IDL.Opt(OrganizationProfile)],
        [],
      ),
    'createProfile' : IDL.Func(
        [UserProfile__1],
        [IDL.Opt(UserProfileFull)],
        [],
      ),
    'editOrganization' : IDL.Func(
        [OrganizationId, OrganizationEdit],
        [IDL.Opt(IDL.Bool)],
        [],
      ),
    'getFeedItems' : IDL.Func(
        [IDL.Opt(IDL.Nat)],
        [IDL.Opt(IDL.Vec(HelpRequest))],
        ['query'],
      ),
    'getOrganizationProfile' : IDL.Func(
        [OrganizationId],
        [IDL.Opt(OrganizationProfile)],
        ['query'],
      ),
    'getOrganizationPublic' : IDL.Func(
        [OrganizationId],
        [IDL.Opt(OrganizationPublic)],
        ['query'],
      ),
    'getProfileFull' : IDL.Func([], [IDL.Opt(UserProfileFull)], ['query']),
    'getUserNameByPrincipal' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Vec(UserId))],
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
