import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, ProfilePost } from "..";
import { UserContext } from "../../contexts/user";
import { db } from "../../firebase";
// import ProfilePost from "../profilePost";
import "./style.css";

export default function CategoryDetail(props) {
  const [user, setUser] = useContext(UserContext).user;
  const [recipe, setRecipe] = useContext(UserContext).recipe;
  const [categories, setCategories] = useState(null);
  let username = user.email.replace("@gmail.com", "");
  const [category, setCategory] = useState("");

  //The name of the collection (the users created categorys) is sent as a prop when the user is redirected to the page.
  const categoryName = props.match.params.id;

  useEffect(() => {
    // if (!user) {
    //   history.push("/");
    // }
    db.collection("categories").onSnapshot((snapshot) => {
      setCategories(
        snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
      );
    });
  
  }, []);

  useEffect(() => {
    categories &&
      categories.map((catItem) => {
        if (catItem.id === categoryName) {
          setCategory(catItem);
        }
      }); 
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
    <>
    {category && 
    <div className="category">
      <Navbar />
      <Link className="backLink" to="/profile">Tillbaka</Link>
      
      <div className="collectionName">
        <h1 className="collectionNameh1">{categories && category.post.category}</h1>
      </div>
      <div className="category__list">
        {/* Maps over all the recipes from context to only displays the ones with the correct collection*/}
        {recipe &&
          recipe.map((recipeItem) => {
            if (
              categories &&
              recipeItem.post.username === username &&
              recipeItem.post.userCategorySlug === category.post.slug
            ) {
              return (
                <div key={recipeItem.id}>
                  {/* Props for the posts that have the right collections are sent to profilePosts component*/}
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
    }
    </>
  );
}
