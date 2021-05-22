import { auth, provider} from "../firebase"

export const signInWithGoogle = async () => {
  let user;
  auth.signInWithRedirect(provider)
}

// export const signInWithGoogle = async () => {
//   // signs the user in using Firebase Google authentication, uses a pop up window where the user can select an account
//   //then returns user 
//     let user;
//     await auth.signInWithPopup(provider)
//     .then((res) => {
//         user = res.user
//     })
//     .catch((error) => {
//       console.log(error.message);
//     })

//     return user
// }
  // signs the user out using Firebase Google authentication, when a user is successfullt signed out it returns true
export const logout = async () => {
    let logout_sucess;
    await auth.signOut()
    .then(()  => {
        logout_sucess = true;
    })
    .catch((error) => {
        console.log(error.message)
    })

    return logout_sucess
}