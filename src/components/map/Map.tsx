// getLocation() {
//     return new Promise((yay, nay) => {
//       navigator.geolocation.getCurrentPosition((location) => {
//         console.log({ location });
//         // TODO: Handle user rejection
//         const { latitude, longitude } = location.coords;
//         location =
//           latitude !== null && longitude !== null
//             ? { lat: latitude, lng: longitude }
//             : default_location;
//         this.state.me.user.forEach((user) => (user.location = location));
//         this.state.me.helper.forEach((user) => (user.location = location));
//         this.state.location = location;
//         yay();
//       });
//     });

import { useAppState } from "@/utils/AppState";
import { useNavigate } from "react-router-dom";

//   }
export const Map = () => {
    const default_location = { lat: 45.676998, lng: -111.042931};
    const default_location2 = { lat: 47.606209, lng: -122.332069};
    const {currentItems, setCurrentItems} = useAppState();
    const navigate = useNavigate();

    {currentItems?.length > 0 && (
        currentItems.map(item => (
          <div key={`${item.requestId}`}>
            <h3>{item.name}</h3>
            <p>{item.caption}</p>
            <p className='flex '>
              <span className='mr-2'>Username: </span>
              <a onClick={() => {
                navigate(`/users/${item.userId}`)
              }}
              >{item.userId}</a>
            </p>
          </div>
        ))
      )}
    return (
        <>
            <h1>Map Here</h1>
        </>
    )
}
