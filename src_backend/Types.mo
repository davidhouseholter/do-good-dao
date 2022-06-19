import DistanceMetric "mo:base/Float";
import Math "mo:base/Float";
import Nat "mo:base/Nat";
import Prim "mo:prim";
import Principal "mo:base/Principal";

module {

    public type Timestamp = Int;
    public let pi : Float = 3.14;
    public let pow : Float = 2.718;
    /// View Models
    public type UserProfile = {
      userName: Text;
      name: ?PersonName;
      address: Text;
      location : ?Location;
      
    };

    public type ProfilePerson = {
      personId : PersonId;
    };

    public type UserProfileFull = {
      userId : Text;
      userName : Text;
      rewards : Nat;
      organizations : [OrganizationProfile];
      name : ?PersonName ;
      address: Text;
      location : ?Location;
      helpRequests : [HelpRequestViewPublic]; //where the user is the helper
      helpRequestsNotifications : [HelperRequestNotifictions];
    };

    /// End View Models
    
    /// User profile models
    
    public type UserId = Text; 

    public type Profile = {
      userName : Text ;
      createdAt : Timestamp;
      
      persons : [ProfilePerson];
      organizations : [ProfileOrganization];
      name : ?PersonName ;
      address: Text;
      location : ?Location;
   
    };

    /// End User profile models

    /// Organization models
    
    public type OrganizationId = Nat; 

    // data model -> OrganizationId maps to this object in 
    // the stored state. 
    public type Organization = {
      userId : UserId;
      userName : Text;
      createdAt : Timestamp;
      name : Text ;
      about : Text;
      logoPic : ?LogoPic;
      tags : [Text];
      location : ?Location;
    };

    public type LogoPic = [Nat8]; // encoded as a PNG file
    
    // used to map user to Organizations Map<Types.UserId, Types.ProfileOrganization>
    public type ProfileOrganization = {
        organizationId : OrganizationId;
    };

    public type OrganizationCreate = {
      name : Text ;
      about : Text;
      userName : Text;
    };

    public type OrganizationProfile = {
      organziationId : OrganizationId;
      userName : Text; 
      userId : UserId;
      createdAt : Timestamp;
      name : Text ;
      about : Text;
      logoPic : ?LogoPic;
      tags : [Text];
      location : ?Location;
      persons : [Person];
      requests : [HelpRequest];
    };

    public type OrganizationPublic = {
      organziationId : OrganizationId;
      userName : Text; 
      createdAt : Timestamp;
      name : Text ;
      about : Text;
      logoPic : ?LogoPic;
      tags : [Text];
      location : ?Location;
    };

    public type OrganizationEdit = {
      organziationId : OrganizationId;
      userName : Text; 
      name : Text ;
      about : Text;
      logoPic : ?LogoPic;
      tags : [Text];
      location : ?Location;
    };

    /// End Organization models


    /// Notification messages
    
    public type Message = {
      id: Nat;
      time: Timestamp;
      event: Text;
    };

    /// End Message

    /// HelpRequest Models

    // todo: leader board of all users (total completed, #completed/#accepeted)
    // todo: leader board of above for each organization

    public type HelpRequestLB = {
      userId : UserId;
      score : Nat;
    };

    public type LeaderBoard = {
      helpers: [HelpRequestLB];
    };

    // properties for creating a new HelpRequest.
       
    public type HelpRequestId = Nat; // system generated

    public type HelpRequestInit = {
      name: Text;
      description: Text;
      tags: [Text];
      personId : ?PersonId;
      person : ?PersonCreate;
      location : ?Location;
      rewardAmount: Nat;
      startDate : Timestamp; 
      startDateText : Text;
      dueDate : Timestamp; 
      dueDateText : Text; 

    };

    public type HelpRequestStatus = {
      #active ;
      #inProgress ;
      #completed ;
      #approved ;
    };

    public type Helper = {
      userId : UserId ;
      createdAt : Timestamp ;
      updatedAt : Timestamp ;
      approved : Bool ;
      complete : Bool ;
      acceptComplete : Bool ;
    };

     public type HelperRequestNotifictions = {
      userId : ?UserId ;
      organizationId : OrganizationId ;
      createdAt : Timestamp ;
      updatedAt : Timestamp ;
      message : Text ;
      read : Bool ;
      requestId : HelpRequestId;
    };


    public type HelpRequest = {
      requestId : HelpRequestId;
      organizationId: OrganizationId;
      userId : UserId; // owner
      personId : PersonId; // person to help
      name : Text;
      description : Text;
      createdAt : Timestamp;   
      tags : [Text];
      viewCount : Nat;
      location : ?Location;
      status : HelpRequestStatus;
      helpers : [Helper];
      approvedHelper : ?Helper;
      rewardAmount: Nat;
      startDate : Timestamp; 
      startDateText : Text;
      dueDate : Timestamp; 
      dueDateText : Text; 
    };
    
    public type HelpRequestView = {
      requestId : HelpRequestId;
      organizationId: OrganizationId;
      organization: OrganizationPublic;
      userId : UserId; // owner
      personId : PersonId; // person to help
      name : Text;
      description : Text;
      createdAt : Timestamp;   
      tags : [Text];
      viewCount : Nat;
      location : ?Location;
      status : HelpRequestStatus;
      rewardAmount: Nat;
      startDate : Timestamp; 
      startDateText : Text;
      dueDate : Timestamp; 
      dueDateText : Text; 
      approvedHelper : ?Helper;

    };

    public type HelpRequestViewPublic = {
      requestId : HelpRequestId;
      organizationId: OrganizationId;
      organization: OrganizationPublic;
      userId : UserId; // owner
      name : Text;
      description : Text;
      createdAt : Timestamp;   
      tags : [Text];
      location : ?Location;
      status : HelpRequestStatus;
      rewardAmount: Nat;
      startDate : Timestamp; 
      startDateText : Text;
      dueDate : Timestamp; 
      dueDateText : Text; 
      approvedHelper : ?Helper;
    };
    
    
    public type PersonId = Nat;

    public type Person = {
      personId : PersonId;
      createdAt : Timestamp;   
      organizationId : OrganizationId;
      userId : ?UserId; // used to link a person to a user identity
      location: ?Location;
      address : Text ;
      age : Nat ;
      name : PersonName ;
    } ;

    public type PersonCreate = {
      organizationId : OrganizationId;
      // userId : ?UserId; only link person to user in a merge? // used to link a person to a user identity
      location: ?Location;
      address : Text ;
      age : Nat ;
      name : PersonName ;
    } ;

    public type PersonName = {
      first : Text;
      last : Text;
      middle : Text;
      full : Text;
    };
    /// End HelpRequest
    public type Location = {
      lat: Float;
      lng: Float
    };

    public type PersonType = {
      // caller is a user
      #worker;
      // person is used for requests
      #request;
    };

    /// Role for a caller into the service API.
    /// Common case is #user.
    public type Role = {
      // caller is a user
      #user;
      // caller is the admin
      #admin;
      // caller is not yet a user; just a guest
      #guest
    };

    /// Action is an API call classification for access control logic.
    public type UserAction = {
      /// Create a new user name, associated with a principal and role #user.
      #create;
      /// Update an existing profile, or add to its videos, etc.
      #update;
      /// View an existing profile, or its videos, etc.
      #view;
      /// Admin action, e.g., getting a dump of logs, etc
      #admin
    };

    /// An ActionTarget identifies the target of a UserAction.
    public type ActionTarget = {
      #user : UserId ;

      #organization : OrganizationId; 

      #item : HelpRequestId ;

      #publicItems;

      #all;

      #pubViewOnly
    };

    
    /// For test scripts, the script controls how time advances, and when.
    /// For real deployment, the service uses the IC system as the time source.
    public type TimeMode = { #ic ; #script : Int };

    /// Time mode.
    ///
    /// Controls how the actor records time and names unique IDs.
    ///
    /// For deployment (timeMode = #ic), the time is system time (nanoseconds since 1970-01-01).
    ///
    /// For scripts and CI-based testing, we want to predict and control time from a #script.
    public let timeMode : {#script; #ic} =
      #ic; // deterministic, small-number times in scripts.


    public func deg2rad(deg: Float): Float {return deg * (pi/180)};

    public func getDistanceFromLatLng(l1: Location, l2: Location) : Float { 
      var r : Float = 6371; // radius of the earth in km
      var dlat1 : Float = deg2rad(l1.lat);
      var dlat2 : Float = deg2rad(l2.lat);
      var lat_dif = dlat2 - dlat1;
      var lng_dif = deg2rad(l2.lng-l1.lng);
      var MeanLatitude : Float = (dlat1+dlat2)/2;
      var d : Float = r*((lat_dif**2+(Prim.cos(MeanLatitude)*lng_dif)**2)**0.5);
      return d 
    }

}
