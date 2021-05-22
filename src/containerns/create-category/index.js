import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import firebase from "firebase";
import { UserContext } from "../../contexts/user";
import { Link, useHistory } from "react-router-dom";
import { Navbar } from "..";
import "./style.css";

export default function CreateCategory() {
  const [category, setCategory] = useState("");
  const [user, setUser] = useContext(UserContext).user;
  let history = useHistory();

  //When the component is loaded i check if the user is logged in, if not the user is redirected to startpage
  useEffect(() => {
    if (!user) {
      history.push("/");
    }
  }, []);

  //Uploads a new user collection (userCategory) to the database, and creates a slug to use as prop is navigation
  const handleUpload = () => {
    db.collection("categories").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      category: category,
      slug: category.replace(" ", "").replace("å", "a").replace("ä", "a").replace("ö", "o").toLowerCase(),
      username: user.email.replace("@gmail.com", ""),
      profileUrl: user.photoURL,
    });
    setCategory("");
    history.push("/profile");
  };

  return (
    <div className="createCategory__outer">
      <Navbar />
      {/* Form for creating a new category */}
      {user && (
        <Link className="createCategory__link" to="/profile">
          Tillbaka
        </Link>
      )}
      <div className="createCategory">
        <div className="createCategory__wrapper">
          <h1>Lägg till ny samling</h1>
          <label htmlFor="categoryname">Samlingens namn</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          {/* Adds a new cateory on click */}
          <button className="createCategory__btn" onClick={handleUpload}>
            Lägg till 
          </button>
        </div>
      </div>
    </div>
  );
}
