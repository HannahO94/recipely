import React, { useContext } from 'react'
import { UserContext } from '../../contexts/user'
import { signInWithGoogle } from '../../services/auth'
import "./style.css"

export default function SignInBtn() {
    const [user, setUser] = useContext(UserContext).user

    //This function runs a service authentication function to log a user in, it is async and
    //when a user is returned it is set to context to be used in the rest of the application
    const signInBtnClick = async () => {
        // let userBySignIn = await 
        signInWithGoogle()
        // if(userBySignIn) setUser(userBySignIn)
    }

    return (
        <div className="signInBtn" onClick={signInBtnClick}>
            <p>Sign in with Google</p>
        </div>
    )
}
