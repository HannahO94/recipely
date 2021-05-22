import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/user";
import { db, auth } from "../../firebase";
import Post from "../post";
import "./style.css";

export const categoryList = [
  {
    id: 1,
    name: "food",
  },
  {
    id: 2,
    name: "desert",
  },
  {
    id: 3,
    name: "drink",
  },
  {
    id: 4,
    name: "X",
  },
];

export default function Feed() {
  const [category, setCategory] = useState(null);
  const [recipe, setRecipe] = useContext(UserContext).recipe;
  const [user, setUser] = useContext(UserContext).user


//All recipes are fetched from the database when the component is loaded and saves them to context
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setRecipe(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  console.log(user)
  return (
    <div className="feedpage">
      <div className="feed">
        <div className="feed__category">
          <p>Sort by category</p>
          
          {categoryList.map((categoryItem) => {
            //maps over all the static categories and prints them to the screen 
            return (
              //The user can choose a category by clicking one of the buttons, only recipes with that 
              //category will be displayed
              <button
                className="feed__category__button"
                key={categoryItem.id}
                onClick={(e) =>
                  setCategory(
                    category === categoryItem.name || categoryItem.name === "X"
                      ? null
                      : categoryItem.name
                  )
                }
              >
                {categoryItem.name}
              </button>
            );
          })}
        </div>
        {/* maps over all the posts  */}
        {recipe &&
          recipe.map(({ id, post }) => {
            // Only shown posts that are public
            if (post.public) {
              //Checks if the post is the selected category (From the start it is no category selected, and if the type is write)
              if (
                post.category === category ||
                (category === null && post.type === "write")
              ) {
                // Sends the props for receipe type write to the post component
                return (
                  <Post
                    key={id}
                    id={id}
                    type={post.type}
                    profileUrl={post.profileUrl}
                    username={post.username}
                    photoUrl={post.photoUrl}
                    title={post.title}
                    ingredients={post.ingredientList}
                    description={post.description}
                    category={post.category}
                    comments={post.comments}
                  />
                );
              }
               //Checks if the post is the selected category (From the start it is no category selected, and if the type is link)
              if (
                post.category === category ||
                (category === null && post.type === "link")
              ) {
                return (
                   // Sends the props for receipe type link to the post component
                  <Post
                    key={id}
                    id={id}
                    type={post.type}
                    profileUrl={post.profileUrl}
                    username={post.username}
                    photoUrl={post.photoUrl}
                    title={post.title}
                    link={post.link}
                    category={post.category}
                    comments={post.comments}
                  />
                );
              }
            } else {
              <></>;
            }
          })}
      </div>
    </div>
  );
}
