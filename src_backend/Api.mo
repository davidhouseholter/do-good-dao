
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import TrieMap "mo:base/TrieMap";

import Database "./Database";
import Event "./lib/Event";
import Types "./Types";

shared ({caller = initPrincipal}) actor class API () {
  public type UserProfile = Types.UserProfile;
  public type UserProfileFull = Types.UserProfileFull;
  public type UserId = Types.UserId;

  var state = Database.empty({ admin = initPrincipal });

  public query ({caller}) func whoami() : async Principal {
    return caller;
  };

  public query func checkUsernameAvailable(userName_ : Text): async Bool {

    switch (state.profiles.get(userName_)) {
      case (?_) { /* error -- ID already taken. */ false };
      case null { /* ok, not taken yet. */ true };
    }
  };

  public shared(msg) func createProfile(userData : UserProfile) : async ?UserProfileFull {
    do ? {
     
      let userId = Principal.toText(msg.caller);
     
      accessCheck(msg.caller, #create, #user userId)!;
      createProfile_(msg.caller, userData)!;
      // return the full profile info
      getProfileFull_(msg.caller)!;
    }
  };

  public shared(msg) func getUserNameByPrincipal(p:Principal) : async ?[UserId] {
    if ( msg.caller == p ) {
      getUserNameByPrincipal_(p);
    } else {
      // access control check fails; do not reveal username of p.
      null
    }
  };

  public query(msg) func getProfileFull(): async ?UserProfileFull {
    do ? {    
      if(Principal.isAnonymous(msg.caller)) {
        ();
      };
      let user = state.profiles.get(Principal.toText(msg.caller))!;
      getProfileFull_(msg.caller)!;
    };
  };

  public query(msg) func getUserProfile(userId : UserId) : async ?UserProfile {
    do ? {
      accessCheck(msg.caller, #view, #user userId)!;
      getUserProfile_(userId)!
    }
  };

  public query(msg) func getUsersPublic(limit : ?Nat) : async ?[Types.UserProfile] {
    do ? {
      accessCheck(msg.caller, #view, #publicItems)!;
      getUsersPublic_(limit)!;
    }
  };

  public shared(msg) func createOrganization(i : Types.OrganizationCreate) : async ?Types.OrganizationProfile {
    do ? {
      let userId = Principal.toText(msg.caller);

      // roadmap: check user has verified identity.
      accessCheck(msg.caller, #create, #user userId)!;
    
      let newId = createOrganization_(userId, i)!;
      
      getOrganizationProfile_(newId)!;
    };
  };

  public shared(msg) func editOrganization(orgId: Types.OrganizationId, orgData : Types.OrganizationEdit) : async ?Bool {
    do ? {
      accessCheck(msg.caller, #create, #organization orgId)!;
      let currentOrg = getOrganization_(orgId)!;
      let result = editOrganization_(orgId, currentOrg, orgData);
      result;
    };
  };

  public query(msg) func getOrganizationPublic(orgId : Types.OrganizationId) : async ?Types.OrganizationPublic {
    do ? {
      accessCheck(msg.caller, #view, #publicItems)!;
      getOrganizationPublic_(orgId)!;
    }
  };

  public query(msg) func getOrganizationProfile(orgId : Types.OrganizationId) : async ?Types.OrganizationProfile {
    do ? {
      accessCheck(msg.caller, #update, #organization orgId)!;
       let org  = getOrganizationProfile_(orgId)!;

    }
  };

  public query(msg) func getFeedItems(limit : ?Nat) : async ?[Types.HelpRequest] {
    do ? {
      // privacy check: because we personalize the feed (example is abuse flag information).
      accessCheck(msg.caller, #view, #publicItems)!;
      getFeedItems_(limit)!;
    }
  };

  public shared(msg) func createHelpRequest(orgId: Types.OrganizationId, i : Types.HelpRequestInit) : async ?Types.HelpRequest {
    do ? {
      let userId = Principal.toText(msg.caller);
      accessCheck(msg.caller, #update, #organization orgId)!;
      let requestId = createHelpRequest_(Principal.toText(msg.caller), orgId, i)!;
      getHelpRequest_(requestId)!
    }
  };

  func getFeedItems_(limit : ?Nat) : ?[Types.HelpRequest] {
    do ? {
      let buf = Buffer.Buffer<Types.HelpRequest>(0);
      label loopItems
      for ((itemId, item) in state.helpRequests.entries()) {
        switch limit { case null { }; case (?l) { if (buf.size() == l) { break loopItems } } };
        let vs = getHelpRequest_(itemId)!;
        buf.add(vs);
      };
      buf.toArray()
    }
  };

  // Help Request Private Functions
    
  func getHelpRequest_ (requestId : Types.HelpRequestId) : ?Types.HelpRequest {
    do ? {
      let v = state.helpRequests.get(requestId)!;
      {
        requestId = requestId ;
        personId = v.personId;
        userId = v.userId ;
        createdAt = v.createdAt ;
        description = v.description ;
        tags = v.tags ;
        viewCount = v.viewCount ;
        name = v.name ;
        location = null ;
        status = #active ;
      }
    }
  };

  func createHelpRequest_(userId:Types.UserId, orgId:Types.OrganizationId, i : Types.HelpRequestInit) : ?Types.HelpRequestId {
    do ? {
      var requestPeronsId : ?Types.PersonId = null;
      

      if(i.personId != null) {
        // check access ;
        Debug.print("PersonId");
        let person = getPerson_(i.personId!)!;
        requestPeronsId := i.personId;
      } else {
        // check i.perons is valid
        // create person
        let newPersonId = ?createPerson_(userId, orgId, i.person!)!;
        let res = ?addOrgPerson_(orgId, newPersonId!)!;
        requestPeronsId := newPersonId;
      };
      let now = timeNow_();
      let newId = state.helpRequests.size() + 1;
      switch (state.helpRequests.get(newId)) {
        case (?_) { 
          null!
        };
        case null { /* ok, not taken yet. */
            state.helpRequests.put(newId,
            {
              requestId = newId;
              userId = userId ;
              name = i.name ;
              createdAt = now ;
              description =  i.description ;
              tags = i.tags ;
              viewCount = 0 ;
              location = i.location ;
              status = #active ;
              personId = requestPeronsId!;
            });
            addOrgHelpRequest_(orgId, newId)!;
            logEvent(#createHelpRequest({info = i}));
            newId
          };
        }
      }
  };

  func createPerson_(caller: UserId, orgId: Types.OrganizationId, p : Types.PersonCreate) : ?Types.PersonId {
    do ? {
     let now = timeNow_();
     let newId = state.persons.size() + 1;
     switch (state.persons.get(newId)) {
      case (?_) { 
        null!
      };
      case null { /* ok, not taken yet. */
          state.persons.put(newId,
          {
            personId = newId;
            userId = null;
            organizationId = orgId;
            address = p.address;
            age = p.age;
            name = {
              first = p.name.first;
              last = p.name.last;
              middle = p.name.middle;
              full = p.name.full;
            };
            createdAt = now ;
            location = p.location ;
          });
          logEvent(#createPerson({info = p}));
         
          newId;
        };
      }
   }
  };

  func getPerson_(personId : Types.PersonId) : ?Types.Person {
    do ? {
      let person = state.persons.get(personId)!;
      // todo: check access, msg caller belongs to the org
      // of person.organizationId;
      {
        userId = person.userId;
        personId = personId;
        address = person.address;
        age = person.age;
        location = person.location;
        name = person.name;
        organizationId = person.organizationId;    
        createdAt = person.createdAt ;
      };
    };
  };
  
  func createOrganization_(userId:Types.UserId, i : Types.OrganizationCreate) : ?Types.OrganizationId {
    let now = timeNow_();
    var newId = state.organizations.size() + 1;
    switch (state.organizations.get(newId)) {
    case (?_) { /* error -- ID already taken. */ null };
    case null { /* ok, not taken yet. */
        state.organizations.put(newId,
        {
          createdAt = now;
          requestId = newId;
          userId = userId ;
          userName = ""; 
          name = i.name ;
          about =  i.about ;
          tags = [];
          location = null ;
          logoPic = null ;
          organizations = [newId];
          persons = [];
        });
        state.organizationPersons.put(newId, []);
        state.organizationHelpRequests.put(newId, []);
        let x = ?addProfileOrg_(userId, newId);

        logEvent(#createOrganization({info = i}));
      
        ?newId
      };
    }
  };
  
  func editOrganization_(orgId: Types.OrganizationId, orgData : Types.Organization, orgEdit : Types.OrganizationEdit) : Bool {
    state.organizations.put(orgId,
    {
      createdAt = orgData.createdAt;
      userId = orgData.userId;
      userName = orgData.userName;
      name = orgData.name ;
      about =  orgData.about ;
      tags = [];
      location = null ;
      logoPic = null ;
    });
    logEvent(#eitOrganization({info = orgEdit}));
  
    true
  };

  func getOrganization_ (orgId : Types.OrganizationId) : ?Types.Organization {
    do ? {
      let v = state.organizations.get(orgId)!;
      {
        organziationId = orgId;
        userId = v.userId ;
        userName = v.userName;
        createdAt = v.createdAt ;
        about = v.about ;
        tags = v.tags ;
        name = v.name ;
        location = null ;
        logoPic = null ;
      }
    }
  };

  func getOrganizationProfile_ (orgId : Types.OrganizationId) : ?Types.OrganizationProfile {
    do ? {
      // todo: limit & paginate
      let p = state.organizationPersons.get(orgId)!;
      let personBuffer = Buffer.Buffer<Types.Person>(p.size());
      for (item in p.vals()) {
        let person = getPerson_(item)!;
        personBuffer.add(person);
      };
      //  todo: limit & paginate
      let r = state.organizationHelpRequests.get(orgId)!;
      let orgRequests = Buffer.Buffer<Types.HelpRequest>(p.size());
      for (item in r.vals()) {
        let req = getHelpRequest_(item)!;
        orgRequests.add(req);
      };
      let v = getOrganization_(orgId)!;
      {
        organziationId = orgId;
        userId = v.userId ;
        userName = v.userName;
        createdAt = v.createdAt ;
        about = v.about ;
        tags = v.tags ;
        name = v.name ;
        location = null ;
        logoPic = null ;
        persons = personBuffer.toArray();
        requests = orgRequests.toArray();
      };
    }
  };
  
  func getOrganizationPublic_ (orgId : Types.OrganizationId) : ?Types.OrganizationPublic {
    do ? {
      let v = state.organizations.get(orgId)!;
      {
        organziationId = orgId;
        userName = v.userName;
        createdAt = v.createdAt ;
        about = v.about ;
        tags = v.tags ;
        name = v.name ;
        location = null ; // to-do: make privacy setting
        logoPic = null ;
      }
    }
  };

  func getProfileFull_(user: Principal): ?UserProfileFull {
    do ? {
      let userId = Principal.toText(user);
      
      accessCheck(user, #update, #user userId)!;
      let userData = getProfile_(userId)!;
      let buf = Buffer.Buffer<Types.OrganizationProfile>(0);
      for (item in userData.organizations.vals()) {
        let orgData = getOrganizationProfile_(item.organizationId)!;
        buf.add(orgData);
      };

      let profile = state.profiles.get(userId)!;
      
      {
        userId = userId;
        userName = profile.userName;
        rewards = 0; 
        organizations = buf.toArray();
        persons = [];
      };
    }
  };

  func getUserProfile_(userId : UserId) : ?UserProfile {
    do ? {
      let profile = state.profiles.get(userId)!;
      {
        userName = profile.userName; 
       
      }
    }
  };

  func getProfile_(userId : UserId) : ?Types.Profile {
    do ? {
      let p = state.profiles.get(userId)!;
      {
        userName = p.userName; 
        organizations = p.organizations;
        persons = p.persons;
        createdAt = p.createdAt;
        location = p.location;
      }
    }
  };

  func getUsersPublic_(limit : ?Nat) : ?[Types.UserProfile] {
    do ? {
      let buf = Buffer.Buffer<Types.UserProfile>(0);
      label loopAllUsers
      for ((itemId, item) in state.profiles.entries()) {
        
        switch limit { case null { }; case (?l) { if (buf.size() == l) { break loopAllUsers } } };
        let vs = getUserProfile_(itemId)!;
        buf.add(vs);
      };
      buf.toArray()
    }
  };

  func createProfile_(user: Principal, userData : UserProfile) : ?() {
    let userId = Principal.toText(user);
    switch (state.profiles.get(userId)) {
      case (?_) { /* error -- ID already taken. */ null };
      case null { /* ok, not taken yet. */
        let now = timeNow_();
       
        state.profiles.put(userId, {
            userName = userData.userName ;
            createdAt = now ;
            location = null ;
            organizations = [];
            persons = [];
        });

        logEvent(#createProfile({userName=userData.userName;}));

        state.access.userRole.put(userId, #user);

        state.access.userPrincipal.put(userId, user);

        ?()
      };
    }
  };

  func addProfileOrg_(userId: UserId, orgId: Types.OrganizationId): ?() {
    do ? {
      let userData = getProfile_(userId)!;
      let buf = Buffer.Buffer<Types.ProfileOrganization>(userData.organizations.size() + 1);
      for (item in userData.organizations.vals()) {
        buf.add(item);
      };
      buf.add({
        organizationId = orgId
      });
      state.profiles.put(userId, {
        userName = userData.userName ;
        createdAt = userData.createdAt ;
        persons = userData.persons  ;
        organizations = buf.toArray() ;
        location = userData.location;
      });
      ();
    }
  };

  func addOrgPerson_(orgId: Types.OrganizationId, personId: Types.PersonId): ?() {
    do ? {
      let p = state.organizationPersons.get(orgId)!;
      let buf = Buffer.Buffer<Types.PersonId>(p.size() + 1);
      for (item in p.vals()) {
        buf.add(item);
      };
      buf.add(personId);
      state.organizationPersons.put(orgId, buf.toArray());
      ();
    }
  };

  func addOrgHelpRequest_(orgId: Types.OrganizationId, personId: Types.PersonId): ?() {
    do ? {
      let p = state.organizationHelpRequests.get(orgId)!;
      let buf = Buffer.Buffer<Types.PersonId>(p.size() + 1);
      for (item in p.vals()) {
        buf.add(item);
      };
      buf.add(personId);
      state.organizationHelpRequests.put(orgId, buf.toArray());
      ();
    }
  };

  func accessCheck(caller : Principal, action : Types.UserAction, target : Types.ActionTarget) : ?() {
    state.access.check(timeNow_(), caller, action, target)
  };

  func getFeedHelpRequests_(limit : ?Nat) : ?[Types.HelpRequest] {
    do ? {
      let buf = Buffer.Buffer<Types.HelpRequest>(0);
      label loopItems
      for ((itemId, item) in state.helpRequests.entries()) {
        switch limit { case null { }; case (?l) { if (buf.size() == l) { break loopItems } } };
        let vs = getHelpRequest_(itemId)!;
        buf.add(vs);
      };
      buf.toArray()
    }
  };

  func getUserNameByPrincipal_(p:Principal) : ?[UserId] {
    ?state.access.userPrincipal.get1(p)
  };

  var timeMode : {#ic ; #script} =
    switch (Types.timeMode) {
    case (#ic) #ic;
    case (#script _) #script
  };

  var scriptTime : Int = 0;

  func timeNow_() : Int {
    switch timeMode {
      case (#ic) { Time.now() };
      case (#script) { scriptTime };
    }
  };

  
  /// log the given event kind, with a unique ID and current time
  func logEvent(ek : Event.EventKind) {
    
    state.eventLog.add(
      {
        id = state.eventCount;
        time = timeNow_();
        kind = ek
      });
    
    state.eventCount += 1;
  };

};
  
