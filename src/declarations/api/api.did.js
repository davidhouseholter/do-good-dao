export const idlFactory = ({ IDL }) => {
  const HelpRequestId = IDL.Nat;
  const UserId = IDL.Text;
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
  const Timestamp = IDL.Int;
  const PersonId = IDL.Nat;
  const HelpRequestInit = IDL.Record({
    'dueDateText' : IDL.Text,
    'rewardAmount' : IDL.Nat,
    'person' : IDL.Opt(PersonCreate),
    'name' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'dueDate' : Timestamp,
    'description' : IDL.Text,
    'personId' : IDL.Opt(PersonId),
    'startDateText' : IDL.Text,
    'location' : IDL.Opt(Location),
    'startDate' : Timestamp,
  });
  const HelpRequestStatus = IDL.Variant({
    'active' : IDL.Null,
    'completed' : IDL.Null,
    'approved' : IDL.Null,
    'inProgress' : IDL.Null,
  });
  const Helper = IDL.Record({
    'acceptComplete' : IDL.Bool,
    'userId' : UserId,
    'createdAt' : Timestamp,
    'complete' : IDL.Bool,
    'updatedAt' : Timestamp,
    'approved' : IDL.Bool,
  });
  const HelpRequest = IDL.Record({
    'status' : HelpRequestStatus,
    'organizationId' : OrganizationId,
    'approvedHelper' : IDL.Opt(Helper),
    'requestId' : HelpRequestId,
    'dueDateText' : IDL.Text,
    'rewardAmount' : IDL.Nat,
    'userId' : UserId,
    'name' : IDL.Text,
    'createdAt' : Timestamp,
    'tags' : IDL.Vec(IDL.Text),
    'dueDate' : Timestamp,
    'description' : IDL.Text,
    'personId' : PersonId,
    'viewCount' : IDL.Nat,
    'helpers' : IDL.Vec(Helper),
    'startDateText' : IDL.Text,
    'location' : IDL.Opt(Location),
    'startDate' : Timestamp,
  });
  const OrganizationCreate = IDL.Record({
    'userName' : IDL.Text,
    'about' : IDL.Text,
    'name' : IDL.Text,
  });
  const Person = IDL.Record({
    'age' : IDL.Nat,
    'organizationId' : OrganizationId,
    'userId' : IDL.Opt(UserId),
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
    'userId' : UserId,
    'name' : IDL.Text,
    'createdAt' : Timestamp,
    'tags' : IDL.Vec(IDL.Text),
    'persons' : IDL.Vec(Person),
    'logoPic' : IDL.Opt(LogoPic),
    'requests' : IDL.Vec(HelpRequest),
    'location' : IDL.Opt(Location),
  });
  const UserProfile = IDL.Record({
    'userName' : IDL.Text,
    'name' : IDL.Opt(PersonName),
    'address' : IDL.Text,
    'location' : IDL.Opt(Location),
  });
  const HelperRequestNotifictions = IDL.Record({
    'organizationId' : OrganizationId,
    'requestId' : HelpRequestId,
    'userId' : IDL.Opt(UserId),
    'createdAt' : Timestamp,
    'read' : IDL.Bool,
    'updatedAt' : Timestamp,
    'message' : IDL.Text,
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
  const HelpRequestViewPublic = IDL.Record({
    'status' : HelpRequestStatus,
    'organizationId' : OrganizationId,
    'approvedHelper' : IDL.Opt(Helper),
    'requestId' : HelpRequestId,
    'dueDateText' : IDL.Text,
    'rewardAmount' : IDL.Nat,
    'userId' : UserId,
    'name' : IDL.Text,
    'createdAt' : Timestamp,
    'tags' : IDL.Vec(IDL.Text),
    'dueDate' : Timestamp,
    'description' : IDL.Text,
    'organization' : OrganizationPublic,
    'startDateText' : IDL.Text,
    'location' : IDL.Opt(Location),
    'startDate' : Timestamp,
  });
  const UserProfileFull = IDL.Record({
    'userName' : IDL.Text,
    'helpRequestsNotifications' : IDL.Vec(HelperRequestNotifictions),
    'userId' : IDL.Text,
    'name' : IDL.Opt(PersonName),
    'helpRequests' : IDL.Vec(HelpRequestViewPublic),
    'address' : IDL.Text,
    'rewards' : IDL.Nat,
    'location' : IDL.Opt(Location),
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
  const API = IDL.Service({
    'acceptCompleteHelperRequest' : IDL.Func(
        [HelpRequestId, UserId],
        [IDL.Opt(IDL.Bool)],
        [],
      ),
    'acceptHelperRequest' : IDL.Func(
        [HelpRequestId, UserId],
        [IDL.Opt(IDL.Bool)],
        [],
      ),
    'applyForHelpRequest' : IDL.Func([HelpRequestId], [IDL.Opt(IDL.Bool)], []),
    'checkUsernameAvailable' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'completeHelperRequest' : IDL.Func(
        [HelpRequestId],
        [IDL.Opt(IDL.Bool)],
        [],
      ),
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
    'createProfile' : IDL.Func([UserProfile], [IDL.Opt(UserProfileFull)], []),
    'editOrganization' : IDL.Func(
        [OrganizationId, OrganizationEdit],
        [IDL.Opt(IDL.Bool)],
        [],
      ),
    'getFeedItems' : IDL.Func(
        [IDL.Opt(IDL.Nat)],
        [IDL.Opt(IDL.Vec(HelpRequestViewPublic))],
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
        ['query'],
      ),
    'getUserProfile' : IDL.Func([UserId], [IDL.Opt(UserProfile)], ['query']),
    'getUsersPublic' : IDL.Func(
        [IDL.Opt(IDL.Nat)],
        [IDL.Opt(IDL.Vec(UserProfile))],
        ['query'],
      ),
    'updateUserProfile' : IDL.Func(
        [UserId, UserProfile],
        [IDL.Opt(IDL.Bool)],
        [],
      ),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return API;
};
export const init = ({ IDL }) => { return []; };
