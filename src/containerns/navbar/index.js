import React, { useContext, useEffect } from "react";
import "./style.css";
import { SignInBtn } from "../../components";
import { UserContext } from "../../contexts/user";
import { Link } from "react-router-dom";
import { auth } from "../../firebase"

export default function Navbar() {
  const [user, setUser] = useContext(UserContext).user;

  useEffect(() => {
    if(!user){
    auth.getRedirectResult()
      .then((result) => {
        // if (result.credential) {
        //   /** @type {firebase.auth.OAuthCredential} */
        //   var credential = result.credential;
        //   var token = credential.accessToken;
        // }
      // The signed-in user info.
      setUser(result.user)
  
    }).catch((error) => {
        console.log(error)
    });
  }
    }, []);

  return (
    <div className="navbar">
      <Link className="navbar__link" to="/">
        RECIPELY
      </Link>
     {/* If the user is logged in the the link to the profile is shown, otherwise he sign in button*/}
      {user ? (
        <Link to="/profile">
          <img className="navbar__img" src={user.photoURL} />
        </Link>
      ) : (
        <SignInBtn />
      )}
    </div>
  );
}
