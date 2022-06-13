export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'callerPrincipal' : IDL.Func([], [IDL.Principal], []),
    'getValue' : IDL.Func([], [IDL.Nat], ['query']),
    'increment' : IDL.Func([], [], []),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
