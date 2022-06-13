
import Hash "mo:base/Hash";
import Prelude "mo:base/Prelude";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";

// import non-base primitives
import Role "Role";
import Rel "Rel";
import RelObj "RelObj";
import SeqObj "SeqObj";

// types in separate file
import Types "../Types";

 module Event {

    public func equal(x:Event, y:Event) : Bool { x == y };
    public type Log = SeqObj.Seq<Event>;

    public type CreateProfile = {
      userName : Text;
    };

    public type CreateHelpRequest = {
      info : Types.HelpRequestInit;
    };

    public type EventKind = {
      #reset : Types.TimeMode;
      #createProfile : CreateProfile;
      #createHelpRequest : CreateHelpRequest;
    };

    public type Event = {
      id : Nat; // unique ID, to avoid using time as one (not always unique)
      time : Int; // using mo:base/Time and Time.now() : Int
      kind : EventKind;
    };


  };
