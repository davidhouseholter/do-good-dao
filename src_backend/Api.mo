
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";

import Database "./Database";
import Event "./lib/Event";
import Types "./Types";

shared ({caller = initPrincipal}) actor class API () {

  // todo make stable
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

  public shared(msg) func createProfile(userData : Types.UserProfile) : async ?Types.UserProfileFull {
    do ? {
     
      let userId = Principal.toText(msg.caller);
     
      accessCheck(msg.caller, #create, #user userId)!;
      createProfile_(msg.caller, userData)!;
      // return the full profile info
      getProfileFull_(msg.caller)!;
    }
  };

  public query(msg) func getUserNameByPrincipal(p:Principal) : async ?[Types.UserId] {
    if ( msg.caller == p ) {
      getUserNameByPrincipal_(p);
    } else {
      // access control check fails; do not reveal username of p.
      null
    }
  };

  public query(msg) func getProfileFull(): async ?Types.UserProfileFull {
    do ? {    
      if(Principal.isAnonymous(msg.caller)) {
        ();
      };
      let user = state.profiles.get(Principal.toText(msg.caller))!;
      getProfileFull_(msg.caller)!;
    };
  };

  public query(msg) func getUserProfile(userId : Types.UserId) : async ?Types.UserProfile {
    do ? {
      accessCheck(msg.caller, #view, #user userId)!;
      getUserProfile_(userId)!
    }
  };

  public shared(msg) func updateUserProfile(userId : Types.UserId, userData: Types.UserProfile) : async ?Bool {
    do ? {
       let userId = Principal.toText(msg.caller);
     
      accessCheck(msg.caller, #create, #user userId)!;
      let user = state.profiles.get(userId)!;
      let res = updateProfile_(userId, user, userData)!;
      res
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
      result!;
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

  public query(msg) func getFeedItems(limit : ?Nat) : async ?[Types.HelpRequestViewPublic] {
    do ? {
      let userId = Principal.toText(msg.caller);

      // privacy check: because we personalize the feed (example is abuse flag information).
      // accessCheck(msg.caller, #view, #publicItems)!;
      getFeedHelpRequests_(userId, limit)!;
    }
  };

  public shared(msg) func applyForHelpRequest(requestId : Types.HelpRequestId) : async ?Bool {
    do ? {
      let userId = Principal.toText(msg.caller);
      let request = state.helpRequests.get(requestId)!;
      // privacy check: because we personalize the feed (example is abuse flag information).
      accessCheck(msg.caller, #update, #organization (request.organizationId))!;
      let org = getOrganization_(request.organizationId)!;
      addHelperRequest_(request, userId, org.userId)!;
      true
    }
  };

  public shared(msg) func acceptHelperRequest(requestId : Types.HelpRequestId, helperId : Types.UserId) : async ?Bool {
    do ? {
      let userId = Principal.toText(msg.caller);
      let request = state.helpRequests.get(requestId)!;
      // privacy check: because we personalize the feed (example is abuse flag information).
      accessCheck(msg.caller, #update, #organization (request.organizationId))!;
      acceptHelperRequest_(request, helperId)!;
      true
    }
  };

  public shared(msg) func completeHelperRequest(requestId : Types.HelpRequestId) : async ?Bool {
    do ? {
      let userId = Principal.toText(msg.caller);
      let request = state.helpRequests.get(requestId)!;
      // privacy check: because we personalize the feed (example is abuse flag information).
      accessCheck(msg.caller, #update, #organization (request.organizationId))!;
      let org = getOrganization_(request.organizationId)!;
      completeHelperRequest_(request, userId, org.userId)!;
      true
    }
  };

  public shared(msg) func acceptCompleteHelperRequest(requestId : Types.HelpRequestId, helperId : Types.UserId ) : async ?Bool {
    do ? {
      let userId = Principal.toText(msg.caller);
      let request = state.helpRequests.get(requestId)!;
      // privacy check: because we personalize the feed (example is abuse flag information).
      accessCheck(msg.caller, #update, #organization (request.organizationId))!;
      acceptCompleteHelperRequest_(request, helperId)!;
      true
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
    
  func getHelpRequest_ (requestId : Types.HelpRequestId) : ?Types.HelpRequest {
    do ? {
      
      let v = state.helpRequests.get(requestId)!;
      {
        requestId = requestId ;
        personId = v.personId;
        organizationId = v.organizationId;
        userId = v.userId ;
        createdAt = v.createdAt ;
        description = v.description ;
        tags = v.tags ;
        viewCount = v.viewCount ;
        name = v.name ;
        location = v.location ;
        status = v.status;
        helpers = v.helpers ;
        startDate = v.startDate ;
        dueDate =  v.dueDate ;
        dueDateText = v.dueDateText;
        startDateText = v.startDateText;
        rewardAmount = v.rewardAmount ;
        approvedHelper = v.approvedHelper;
      }
    }
  };

  func getHelpRequestPublic_ (requestId : Types.HelpRequestId, userId : Types.UserId) : ?Types.HelpRequestViewPublic {
    do ? {
      
      let v = state.helpRequests.get(requestId)!;
      let org = getOrganizationPublic_(v.organizationId)!;
      var helper : ?Types.Helper = null;
      let helpers = Buffer.Buffer<Types.Helper>(v.helpers.size());
      for (item in v.helpers.vals()) {
          if(item.userId == userId) {
            helper := ?item;
          };
      };


      {
        requestId = requestId ;
        organizationId = v.organizationId ;
        organization = org ;
        userId = v.userId ;
        createdAt = v.createdAt ;
        description = v.description ;
        tags = v.tags ;
        name = v.name ;
        location = null ;
        status = #active ;
        startDate = v.startDate ;
        dueDate =  v.dueDate ;
        dueDateText = v.dueDateText;
        startDateText = v.startDateText;
        rewardAmount = v.rewardAmount ;
        approvedHelper = helper;
      }
    }
  };

  func addHelperRequest_ (request : Types.HelpRequest, userId : Types.UserId, ownerUserId: Types.UserId) : ?(){
    do ? {
      let now = timeNow_();

      let helpers = Buffer.Buffer<Types.Helper>(request.helpers.size() + 1);
      for (item in helpers.vals()) {
        helpers.add(item);
      };
      helpers.add({
        userId = userId ;
        createdAt = now;
        updatedAt = now;
        approved = false;
        complete = false;
        acceptComplete = false;
      });
      state.helpRequests.put(request.requestId, {
        requestId = request.requestId;
        organizationId = request.organizationId;
        userId = request.userId;
        personId = request.personId;
        name = request.name;
        description = request.description;
        createdAt = request.createdAt;
        tags = request.tags;
        viewCount = request.viewCount;
        location = request.location;
        status = request.status;
        helpers = helpers.toArray();
        startDate = request.startDate;
        dueDate =  request.dueDate;
        dueDateText = request.dueDateText;
        startDateText = request.startDateText;
        rewardAmount = request.rewardAmount;
        approvedHelper = request.approvedHelper;
      });

      let helperRequests = state.helpRequestsUser.get(userId)!;

      let bufHelpRequest = Buffer.Buffer<Types.HelpRequestId>(helperRequests.size() + 1);
   
      for (item in helperRequests.vals()) {
        bufHelpRequest.add(item);
      };

      bufHelpRequest.add(request.requestId);
     
      state.helpRequestsUser.put(userId, bufHelpRequest.toArray());

      // notifity non profit they have a new help request
      var message = Text.concat("The request: ", request.name);
      message := Text.concat(message, " has a help request.");
      let res = ?addRequestNotifiction_(ownerUserId, {
        userId = ?userId;
        organizationId = request.organizationId;
        createdAt = timeNow_();
        updatedAt = timeNow_();
        message = message;
        complete = false;
        requestId = request.requestId;
        read = false;
      });

       // notifity the user the help request was sent
      var message2 = Text.concat("The request: ", request.name);
      message2 := Text.concat(message2, " has sent.");
      let res2 = ?addRequestNotifiction_(userId, {
        userId = null;
        organizationId = request.organizationId;
        createdAt = timeNow_();
        updatedAt = timeNow_();
        message = message2;
        complete = false;
        requestId = request.requestId;
        read = false;
      });
      
      ()
    }
  };

  func acceptHelperRequest_ (request : Types.HelpRequest, userId : Types.UserId) : ?(){
    do ? {

      var helper : ?Types.Helper = null;
      let helpers = Buffer.Buffer<Types.Helper>(request.helpers.size());
      for (item in request.helpers.vals()) {
        if(Text.equal(item.userId, userId)) {
          helper := ?{
            userId = item.userId;
            createdAt = item.createdAt;
            updatedAt = timeNow_();
            approved = true;
            complete = item.complete;
            acceptComplete = item.acceptComplete;
           };
           helpers.add(helper!);
        } else {

          helpers.add(item);
        }
      };
     
      state.helpRequests.put(request.requestId, {
        requestId = request.requestId;
        organizationId = request.organizationId;
        userId = request.userId;
        personId = request.personId;
        name = request.name;
        description = request.description;
        createdAt = request.createdAt;
        tags = request.tags;
        viewCount = request.viewCount;
        location = request.location;
        status = #inProgress;
        helpers = helpers.toArray();
        startDate = request.startDate;
        dueDate =  request.dueDate;
        dueDateText = request.dueDateText;
        startDateText = request.startDateText;
        rewardAmount = request.rewardAmount;
        approvedHelper = helper;
      });
      // notifity helper they have been accepted
      var message = Text.concat("The request: ", request.name);
      message := Text.concat(message, " has been accepted.");
      let res = ?addRequestNotifiction_(userId, {
        userId = null;
        organizationId = request.organizationId;
        createdAt = timeNow_();
        updatedAt = timeNow_();
        message = message;
        complete = false;
        requestId = request.requestId;
        read = false;
      });
      ()
    }
  };
 

   func completeHelperRequest_ (request : Types.HelpRequest, userId : Types.UserId, ownerUserId: Types.UserId) : ?(){
    do ? {
      
      var helper : ?Types.Helper = null;
      let helpers = Buffer.Buffer<Types.Helper>(request.helpers.size());
      var i = 0;
      for (item in request.helpers.vals()) {

        if(item.userId == userId) {
          helper := ?{
            userId = item.userId;
            createdAt = item.createdAt;
            updatedAt = timeNow_();
            approved = item.approved;
            complete = true;
            acceptComplete = item.acceptComplete;
           };
           helpers.add(helper!);
        } else {
          helpers.add(item);
        }
      };
     
      state.helpRequests.put(request.requestId, {
        requestId = request.requestId;
        organizationId = request.organizationId;
        userId = request.userId;
        personId = request.personId;
        name = request.name;
        description = request.description;
        createdAt = request.createdAt;
        tags = request.tags;
        viewCount = request.viewCount;
        location = request.location;
        status = #completed;
        helpers = helpers.toArray();
        startDate = request.startDate;
        dueDate =  request.dueDate;
        dueDateText = request.dueDateText;
        startDateText = request.startDateText;
        rewardAmount = request.rewardAmount;
        approvedHelper = helper;
      });
        // notifity helper they have been accepted
      var message = Text.concat("The request: ", request.name);
      message := Text.concat(message, " has been completed!");
      let res = ?addRequestNotifiction_(userId, {
        userId = null;
        createdAt = timeNow_();
        updatedAt = timeNow_();
        message = message;
        complete = false;
        read = false;
        requestId = request.requestId;
        organizationId = request.organizationId;
      });
      // todo: notifity helper they have been complete. rewards amount. leader board progress and current status
      ()
    }
  };

   func acceptCompleteHelperRequest_ (request : Types.HelpRequest, userId : Types.UserId) : ?(){
    do ? {
      
      var helper : ?Types.Helper = null;
      let helpers = Buffer.Buffer<Types.Helper>(request.helpers.size());
      var i = 0;
      for (item in request.helpers.vals()) {

        if(item.userId == userId) {
          helper := ?{
            userId = item.userId;
            createdAt = item.createdAt;
            updatedAt = timeNow_();
            approved = item.approved;
            complete = item.complete;
            acceptComplete = true;
           };
           helpers.add(helper!);
        } else {
          helpers.add(item);
        }
      };
     
      state.helpRequests.put(request.requestId, {
        requestId = request.requestId;
        organizationId = request.organizationId;
        userId = request.userId;
        personId = request.personId;
        name = request.name;
        description = request.description;
        createdAt = request.createdAt;
        tags = request.tags;
        viewCount = request.viewCount;
        location = request.location;
        status = #completed;
        helpers = helpers.toArray();
        startDate = request.startDate;
        dueDate =  request.dueDate;
        dueDateText = request.dueDateText;
        startDateText = request.startDateText;
        rewardAmount = request.rewardAmount;
        approvedHelper = helper;
      });
        // notifity helper they have been accepted
      var message = Text.concat("The request: ", request.name);
      message := Text.concat(message, " has been accepted!");
      let res = ?addRequestNotifiction_(userId, {
        userId = null;
        createdAt = timeNow_();
        updatedAt = timeNow_();
        message = message;
        complete = false;
        read = false;
        requestId = request.requestId;
        organizationId = request.organizationId;
      });
      // todo: notifity helper they have been accepted complete. rewards amount. leader board progress and current status
      // todo: issue tokens
      // todo: leaderboard inserts
      ()
    }
  };

   func addRequestNotifiction_(userId : Types.UserId, data : Types.HelperRequestNotifictions) : ?() {
    do ? {
      let notif = state.helpRequestsUserNotification.get(userId)!;
      let notifList = Buffer.Buffer<Types.HelperRequestNotifictions>(notif.size());
      var i = 0;
      for (item in notif.vals()) {
        notifList.add(item)
      };  
      notifList.add(data);
      state.helpRequestsUserNotification.put(userId, notifList.toArray());
      ()
    }
  };

  func createHelpRequest_(userId: Types.UserId, orgId:Types.OrganizationId, i : Types.HelpRequestInit) : ?Types.HelpRequestId {
    do ? {
      var requestPeronsId : ?Types.PersonId = null;

      if(i.personId != null) {
        // check access ;
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
              organizationId = orgId;
              name = i.name ;
              createdAt = now ;
              description =  i.description ;
              tags = i.tags ;
              viewCount = 0 ;
              location = i.location ;
              status = #active ;
              personId = requestPeronsId!;
              helpers = [];
              approvedHelper = null;
              startDate = i.startDate;
              dueDate =  i.dueDate;
              dueDateText = i.dueDateText;
              startDateText = i.startDateText;
              rewardAmount = i.rewardAmount;
            });
            addOrgHelpRequest_(orgId, newId)!;

            logEvent(#createHelpRequest({info = i}));
            newId
          };
        }
      }
  };

  func createPerson_(caller: Types.UserId, orgId: Types.OrganizationId, p : Types.PersonCreate) : ?Types.PersonId {
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
  
  func editOrganization_(orgId: Types.OrganizationId, orgData : Types.Organization, orgEdit : Types.OrganizationEdit) : ?Bool {
    state.organizations.put(orgId, {
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
    ?true
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

  func getProfileFull_(user: Principal): ?Types.UserProfileFull {
    do ? {

      let userId = Principal.toText(user); 
      accessCheck(user, #update, #user userId)!;
      let userData = getProfile_(userId)!;
      let buf = Buffer.Buffer<Types.OrganizationProfile>(0);

      for (item in userData.organizations.vals()) {
        let orgData = getOrganizationProfile_(item.organizationId)!;
        buf.add(orgData);
      };

      let requests = state.helpRequestsUser.get(userId)!;
      let bufHelpRequest = Buffer.Buffer<Types.HelpRequestViewPublic>(requests.size());
   
      for (item in requests.vals()) {
        let helpRequest = getHelpRequestPublic_(item, userId)!;
        bufHelpRequest.add(helpRequest);
      };

       let helpRequestsNotifications = state.helpRequestsUserNotification.get(userId)!;

      {
        userId = userId;
        userName = userData.userName;
        rewards = 0; 
        organizations = buf.toArray();
        persons = [];
        name = userData.name;
        location = userData.location;
        address = userData.address;
        helpRequests = bufHelpRequest.toArray();
        helpRequestsNotifications = helpRequestsNotifications;
      };
    }
  };

  func getUserProfile_(userId : Types.UserId) : ?Types.UserProfile {
    do ? {
      let profile = state.profiles.get(userId)!;
      {
        userName = profile.userName; 
        address = profile.address;
        location = profile.location;
        name = profile.name;
      }
    }
  };

  func getProfile_(userId : Types.UserId) : ?Types.Profile {
    do ? {
      let p = state.profiles.get(userId)!;
      {
        userName = p.userName; 
        organizations = p.organizations;
        persons = p.persons;
        createdAt = p.createdAt;
        location = p.location;
        name = p.name;
        address = p.address;
      }
    }
  };

  func updateProfile_(userId : Types.UserId, user: Types.Profile, userData : Types.UserProfile) : ?Bool {
      state.profiles.put(userId, {
          userName = user.userName ;
          createdAt = user.createdAt ;
          location = userData.location ;
          organizations = user.organizations;
          persons = user.persons;
          name = userData.name;
          address = userData.address;
      });
      logEvent(#editProfile({info=userData;}));
      ?true
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

  func createProfile_(user: Principal, userData : Types.UserProfile) : ?() {
    let userId = Principal.toText(user);
    switch (state.profiles.get(userId)) {
      case (?_) { /* error -- ID already taken. */ null };
      case null { /* ok, not taken yet. */
        let now = timeNow_();
        state.profiles.put(userId, {
            userName = userData.userName ;
            createdAt = now ;
            location = userData.location ;
            organizations = [];
            persons = [];
            name = userData.name;
            address = userData.address;
            helpRequests = [];
        });

        logEvent(#createProfile({userName=userData.userName;}));

        state.access.userRole.put(userId, #user);

        state.access.userPrincipal.put(userId, user);

        state.helpRequestsUser.put(userId, []);
        state.helpRequestsUserNotification.put(userId, []);

        ?()
      };
    }
  };

  func addProfileOrg_(userId: Types.UserId, orgId: Types.OrganizationId): ?() {
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
        name = userData.name;
        address = userData.address;
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

  //  func addUserHelpRequest_(userId:Types.UserId, requestId: Types.HelpRequestId): ?() {
  //   do ? {
  //     let p = state.helpRequestsUser.get(userId)!;
  //     let buf = Buffer.Buffer<Types.PersonId>(p.size() + 1);
  //     for (item in p.vals()) {
  //       buf.add(item);
  //     };
  //     buf.add(requestId);
  //     state.helpRequestsUser.put(userId, buf.toArray());
  //     ();
  //   }
  // };

  func accessCheck(caller : Principal, action : Types.UserAction, target : Types.ActionTarget) : ?() {
    state.access.check(timeNow_(), caller, action, target)
  };

  func getFeedHelpRequests_(userId : Types.UserId, limit : ?Nat) : ?[Types.HelpRequestViewPublic] {
    do ? {
      let buf = Buffer.Buffer<Types.HelpRequestViewPublic>(0);
      label loopItems
      for ((itemId, item) in state.helpRequests.entries()) {

        switch limit { case null { }; case (?l) { if (buf.size() == l) { break loopItems } } };
        let vs = getHelpRequestPublic_(itemId, userId)!;
        // if(vs.approvedHelper != null )
        // {
        //   break loopItems
        // };
        // if(vs.userId == userId)
        // {
        //   break loopItems
        // };
        buf.add(vs);
      };
      buf.toArray()
    }
  };

  func getUserNameByPrincipal_(p:Principal) : ?[Types.UserId] {
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
  
