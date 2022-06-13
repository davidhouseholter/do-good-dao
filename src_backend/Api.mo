
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

  public shared(msg) func createProfile(userName : Text) : async ?UserProfileFull {
    do ? {
      accessCheck(msg.caller, #create, #user userName)!;
      createProfile_(msg.caller, userName)!;
      // return the full profile info
      getProfileFull_(msg.caller, userName)! // self-view
    }
  };

  public shared(msg) func getUserNameByPrincipal(p:Principal) : async ?[Text] {
    if ( msg.caller == p ) {
      getUserNameByPrincipal_(p);
    } else {
      // access control check fails; do not reveal username of p.
      null
    }
  };

  func  getUserNameByPrincipal_(p:Principal) : ?[Text] {
    ?state.access.userPrincipal.get1(p)
  };

  func createProfile_(p: Principal, userName : Text) : ?() {
    switch (state.profiles.get(userName)) {
      case (?_) { /* error -- ID already taken. */ null };
      case null { /* ok, not taken yet. */
        let now = timeNow_();
        let id = Principal.toText(p);
        state.profiles.put(id, {
            userName = userName ;
            createdAt = now ;
            location = null ;
        });
        logEvent(#createProfile({userName=userName;}));

        state.access.userRole.put(userName, #user);
        state.access.userPrincipal.put(userName, p);
        // success
        ?()
      };
    }
  };
  
  public query(msg) func getProfileFull(caller: Principal, target: UserId): async ?UserProfileFull {
    do ? {
   
      accessCheck(msg.caller, #update, #user target)!;
      getProfileFull_(msg.caller, target)!
       
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
      accessCheck(msg.caller, #view, #allItems)!;
      getUsersPublic_(limit)!;
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

  func getFeedHelpRequests_(limit : ?Nat) : ?[Types.HelpRequest] {
    do ? {
      let buf = Buffer.Buffer<Types.HelpRequest>(0);
      label loopItems
      for ((itemId, item) in state.helpRequests.entries()) {
        switch limit { case null { }; case (?l) { if (buf.size() == l) { break loopItems } } };
        let vs = getItem_(itemId)!;
        buf.add(vs);
      };
      buf.toArray()
    }
  };


  func getUserProfile_(userId : UserId) : ?UserProfile {
    do ? {
            Debug.print(userId);
      let profile = state.profiles.get(userId)!;
      {
        userName = profile.userName; }
    
    }
  };

  func getProfileFull_(caller: Principal, userId: UserId): ?UserProfileFull {
    do ? {
      let userId = Principal.toText(caller);
      let profile = state.profiles.get(userId)!;
      {
        userName = profile.userName; rewards=0
      }
    }
  };

  public query(msg) func getFeedItems(limit : ?Nat) : async ?[Types.HelpRequest] {
    do ? {
      // privacy check: because we personalize the feed (example is abuse flag information).
      accessCheck(msg.caller, #view, #allItems)!;
      getFeedItems_(limit)!;
    }
  };

   func getFeedItems_(limit : ?Nat) : ?[Types.HelpRequest] {
    do ? {
      let buf = Buffer.Buffer<Types.HelpRequest>(0);
      label loopItems
      for ((itemId, item) in state.helpRequests.entries()) {
        switch limit { case null { }; case (?l) { if (buf.size() == l) { break loopItems } } };
        let vs = getItem_(itemId)!;
        buf.add(vs);
      };
      buf.toArray()
    }
  };

  func getItem_ (requestId : Types.HelpRequestId) : ?Types.HelpRequest {
      do ? {
        let v = state.helpRequests.get(requestId)!;
        {
          requestId = requestId ;
          userId = v.userId ;
          createdAt = v.createdAt ;
          caption = v.caption ;
          tags = v.tags ;
          viewCount = v.viewCount ;
          name = v.name ;
          location = null ;
          status = #active
        }
      }
    };

    public shared(msg) func createHelpRequest(i : Types.HelpRequestInit) : async ?Types.HelpRequestId {
      do ? {
        let username = getUserNameByPrincipal_(msg.caller)!;
    
        accessCheck(msg.caller, #update, #user(username[0]))!;
        createItem_(Principal.toText(msg.caller), i)!
      }
    };

    
  // internal function for adding metadata
  func createItem_(userId:Types.UserId, i : Types.HelpRequestInit) : ?Types.HelpRequestId {
    let now = timeNow_();
    let newId = state.helpRequests.size();
    switch (state.helpRequests.get(newId)) {
    case (?_) { /* error -- ID already taken. */ null };
    case null { /* ok, not taken yet. */
        state.helpRequests.put(newId,
        {
          requestId = newId;
          userId = userId ;
          name = i.name ;
          createdAt = now ;
          caption =  i.caption ;
          tags = i.tags ;
          viewCount = 0 ;
          location = null ;
          status = #active ;
        });
        logEvent(#createHelpRequest({info = i}));
        ?newId
      };
    }
  };
    
    func accessCheck(caller : Principal, action : Types.UserAction, target : Types.ActionTarget) : ?() {
      state.access.check(timeNow_(), caller, action, target)
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

  }
  
