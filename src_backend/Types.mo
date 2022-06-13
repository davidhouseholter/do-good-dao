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
    };

    public type UserProfileFull = {
      userName: Text;
      rewards: Nat;
    };

    /// End View Models
    
    /// User profile models
    
    public type UserId = Text; 

    public type Profile = {
      userName : Text ;
      createdAt : Timestamp;
      location : ?Location;
    };

    public type Helper = {
      userId : UserId ;
      createdAt : Timestamp;
      approved : Bool;
    };


    /// End User profile models

    /// Organization models
    
    public type OrganizationId = Nat; 


    public type Organization = {
      organziationId : OrganizationId;
      createdAt : Timestamp;
      name : Text ;
      about : Text;
      logoPic : LogoPic;
      nonProfit: Bool;
      approved : Bool;
    };

    public type LogoPic = [Nat8]; // encoded as a PNG file


    /// End Organization models


    /// Notification messages
    
    public type Message = {
      id: Nat;
      time: Timestamp;
      event: Text;
    };

    /// End Message

    /// HelpRequest Models

    // properties for creating a new HelpRequest.
       
    public type HelpRequestId = Nat; // system generated

    public type HelpRequestInit = {
      name: Text;
      caption: Text;
      tags: [Text];
    };

    public type Location = {
      lat: Float;
      lng: Float
    };
    
    public type Status = {
      #active ;
      #accepted: UserId;
      #confirmed;
    } ;

    public type HelpRequest = {
      requestId : HelpRequestId;
      userId : UserId;
      name : Text;
      caption : Text;
      createdAt : Timestamp;   
      tags : [Text];
      viewCount : Nat;
      location : ?Location;
      status : Status;
    };
    
    /// HelpRequest
   
  

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
      /// User's profile or videos are all potential targets of action.
      #user : UserId ;
      /// Exactly one video is the target of the action.
      #item : HelpRequestId ;

      #allItems;
      /// Everything is a potential target of the action.
      #all;
      /// Everything public is a potential target (of viewing only)
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
