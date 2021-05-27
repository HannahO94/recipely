import { auth, provider} from "../firebase"

// signs the user in using Firebase Google authentication, uses a redirect window where the user can select an account
export const signInWithGoogle = async () => {
  auth.signInWithRedirect(provider)
}

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