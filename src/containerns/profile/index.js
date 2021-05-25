import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Navbar, ProfilePost } from "..";
import { UserContext } from "../../contexts/user";
import { Link, useHistory } from "react-router-dom";
import "./style.css";
import { db } from "../../firebase";
import firebase from "firebase";
import { SignOutBtn } from "../../components";

export default function Profile() {
  const [user, setUser] = useContext(UserContext).user;
  const [recipe, setRecipe] = useContext(UserContext).recipe;
  const [categories, setCategories] = useState(null);
  const [isShowing, setIsShowing] = useState("collections");
  let username;
  let displayName;
  let history = useHistory();
  const categoryArray = [];

  //If the user is not logged in they are redirected to the startpage
  if (user) {
    username = user.email.replace("@gmail.com", "");
    displayName = user.displayName
    // email.replace("@gmail.com", "");
  } else {
    history.push("/");
  }

  //Gets the user collections / user categories from the database and saves to state
  useEffect(() => {
    db.collection("categories").onSnapshot((snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
      );
    });
    categoryArray.push(categories);
  }, []);

  //displays the users collections, if there are no collections, the collection unsorted is added to the database
  useEffect(() => {
    categories &&
      categories.map((catItem) => {
        if (catItem.post.username === username) {
          categoryArray.push(catItem);
        }
      });
    if (categoryArray.length === 0) {
      db.collection("categories").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        category: "Osorterade",
        slug: "osorterade",
        username: user.email.replace("@gmail.com", ""),
        profileUrl: user.photoURL,
      });
    }
  }, [categories]);

  if(recipe === null) {
    db.collection("posts")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      setRecipe(
        snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
      );
    });
  }

  return (
    <div>
      <Navbar />
      <div className="profilePage">
        <div className="profileInfo">
          <div>
            <h1 className="userDisplayName">{user && displayName}</h1>
            {/* Difirent add new button are shown depending on if the user is looking at collections or recipes */}
            {isShowing === "collections" ? (
              <Link className="profile__link" to="/new-category">
                Skapa ny samling <span className="home__linkspan">+</span>
              </Link>
            ) : (
              <Link className="home__link" to="/new-recipe">
                Skapa nytt recept <span className="home__linkspan">+</span>
              </Link>
            )}
          </div>
          {/*Sing out button component is rendered*/}
          <SignOutBtn />
        </div>
        <div className="profile">
          <div className="profile__heading__text">
            {/* Checks ehat the state variable isShowing is, displays diffirent style to the buttons depending on what 
            is selected*/}
            <h2
              className="profile__heading__btn"
              onClick={(e) => setIsShowing("collections")}
              style={{
                backgroundColor:
                  isShowing === "collections" ? "#1e83c2" : "#24a0ed",
              }}
            >
              Samlingar
            </h2>
            <h2
              className="profile__heading__btn"
              onClick={(e) => setIsShowing("recipes")}
              style={{
                backgroundColor:
                  isShowing === "recipes" ? "#1e83c2" : "#24a0ed",
              }}
            >
              Recept
            </h2>
          </div>
          {/*Diffirent page heading if depending on what is showing, collections or recipes */}
          {isShowing === "collections" ? (
            <h3 className="collectionsHeaderText">Mina samlingar</h3>
          ) : (
            <h3 className="collectionsHeaderText">Mina recept</h3>
          )}
          <div
            className={
              isShowing === "collections" ? "collection__list" : "profile__list"
            }
          >
            {/*If collections is selcted, maps over collections and displays themas card and makes them clickable links */}
            {isShowing === "collections" &&
              categories &&
              categories.map((category) => {
                if (category.post.username === username) {
                  return (
                    <div key={category.id} className="profile__itemWrapper">
                      <div className="profile__item">
                        <Link
                          to={`/profile/${category.id}`}
                          className="profile__item__text"
                          key={category.id}
                        >
                          {category.post.category}
                        </Link>
                      </div>
                    </div>
                  );
                }
              })}
              {/*If recipes are shown, sends props to the profilePost component */}
            {isShowing === "recipes" &&
              recipe &&
              recipe.map((recipeItem) => {
                if (recipeItem.post.username === username) {
                  return (
                    <div key={recipeItem.id}>
                      <ProfilePost
                        id={recipeItem.id}
                        profileUrl={recipeItem.post.profileUrl}
                        username={recipeItem.post.username}
                        photoUrl={recipeItem.post.photoUrl}
                        title={recipeItem.post.title}
                        ingredients={recipeItem.post.ingredientList}
                        description={recipeItem.post.description}
                        comments={recipeItem.post.comments}
                      />
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
