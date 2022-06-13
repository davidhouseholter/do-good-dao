import { checkUsername, createUser } from "@/services/ApiService";
import { useAuth } from "@/utils";
import { ExclamationIcon } from "@heroicons/react/outline";
import { FormEvent, useRef, useState } from "react";

export default function SelectUserName({error, username, setUsername}) {
   
  
 
    return (
        <>
          
          <div className="w-full">
            <div className="">

              {error !== "" && (
                <div>
                  <div hidden={error === undefined} className="error">
                    <span className="message">{error}</span>
                  </div>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Choose a unique username.</p>
                  </div>
                </div>
              )}
              <form className="mt-5 sm:flex sm:items-center">
                <div className="w-full sm:max-w-xs">
                
                  <input
                    onChange={(evt) => setUsername(evt.target.value)}
                    value={username}
                    type="text"
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    name="username"
                    id="username"
                    placeholder="username"
                  />

                </div>
              </form>
            </div>
          </div>

</>
    )
}