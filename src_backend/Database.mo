import Hash "mo:base/Hash";
import Prelude "mo:base/Prelude";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import Nat "mo:base/Nat";

// import non-base primitives
import Access "./lib/Access";
import Event "./lib/Event";
import Types "./Types";
import Role "./lib/Role";
import Rel "./lib/Rel";
import RelObj "./lib/RelObj";
import SeqObj "./lib/SeqObj";

module {

  public type Rel<X, Y> = RelObj.RelObj<X, Y>;
  // public type Map<X, Y> = TrieMap.TrieMap<X, Y>;

  /// Database (api storeed state).
  public type Database = {
    access : Access.Access;
    eventLog : Event.Log;
    var eventCount : Nat;
    profiles : TrieMap.TrieMap<Types.UserId, Types.Profile>;
    helpRequests : TrieMap.TrieMap<Types.HelpRequestId, Types.HelpRequest>;
    helpRequestsUser : TrieMap.TrieMap<Types.UserId, [Types.HelpRequestId]>;
    helpRequestsUserNotification: TrieMap.TrieMap<Types.UserId, [Types.HelperRequestNotifictions]>;
    organizations : TrieMap.TrieMap<Types.OrganizationId, Types.Organization>;
    organizationPersons : TrieMap.TrieMap<Types.OrganizationId, [Types.PersonId]>;
    organizationHelpRequests : TrieMap.TrieMap<Types.OrganizationId, [Types.HelpRequestId]>;
    
    persons : TrieMap.TrieMap<Types.PersonId, Types.Person>;
  
  };

  public func empty (init : { admin : Principal }) : Database {
    let equal = (Text.equal, Text.equal);
    let hash = (Text.hash, Text.hash);

    func helpRequestEqual(a: Types.HelpRequest, b: Types.HelpRequest) : Bool = a == b;
    
    func helpRequestHash(m: Types.HelpRequest) : Hash.Hash = Int.hash(m.requestId);

    func messageEqual(a: Types.Message, b: Types.Message) : Bool = a == b;
    func messageHash(m: Types.Message) : Hash.Hash = Int.hash(m.id); 
    
    let helpRequestCreatedFunc = RelObj.RelObj<Types.UserId, Types.HelpRequestId>((Text.hash, Int.hash), (Text.equal, Int.equal));

    let storedDatabase : Database = {
      access = Access.Access({ admin = init.admin; helpRequestCreated = helpRequestCreatedFunc });
      profiles = TrieMap.TrieMap<Types.UserId, Types.Profile>(Text.equal, Text.hash);
      eventLog = SeqObj.Seq<Event.Event>(Event.equal, null);
      helpRequests = TrieMap.TrieMap<Types.HelpRequestId, Types.HelpRequest>(Int.equal, Int.hash);
      helpRequestsUser = TrieMap.TrieMap<Types.UserId, [Types.HelpRequestId]>(Text.equal, Text.hash);
      helpRequestsUserNotification = TrieMap.TrieMap<Types.UserId, [Types.HelperRequestNotifictions]>(Text.equal, Text.hash);
      organizations = TrieMap.TrieMap<Types.OrganizationId, Types.Organization>(Int.equal, Int.hash);
      organizationPersons = TrieMap.TrieMap<Types.OrganizationId, [Types.PersonId]>(Int.equal, Int.hash);
      organizationHelpRequests = TrieMap.TrieMap<Types.OrganizationId, [Types.HelpRequestId]>(Int.equal, Int.hash);
      persons = TrieMap.TrieMap<Types.PersonId, Types.Person>(Int.equal, Int.hash);

      var eventCount = 0;
    };

    storedDatabase // return
  };
}