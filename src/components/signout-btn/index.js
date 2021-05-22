import React, { useContext } from 'react'
import { UserContext } from '../../contexts/user'
import { logout } from '../../services/auth'
import "./style.css"

export default function SignInBtn() {
    const [user, setUser] = useContext(UserContext).user

    //signs a user out, async function that returns true when user is signed out. 
    //Sets user in context to null 
    const signOutBtnClick = async () => {
        let signOut = await logout()
        if(signOut) setUser(null)
    }

    return (
        <div className="signInBtn" onClick={signOutBtnClick}>
            <p>Sign out</p>
        </div>
    )
}
