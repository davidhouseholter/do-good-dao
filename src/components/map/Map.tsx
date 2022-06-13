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
//   }
export const Map = () => {
    const default_location = { lat: 47.371653, lng: 8.512296 };


    return (
        <>
            <h1>Map Here</h1>
        </>
    )
}
