import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "..";
import { Comment, CommentInput } from "../../components";
import { UserContext } from "../../contexts/user";
import { db } from "../../firebase";
import "./style.css";

export default function PostDetail(props) {
  //The recipes unique id is sent as a prop in the URL
  const id = props.match.params.id;
  const [recipe, setRecipe] = useContext(UserContext).recipe;
  const [user, setUser] = useContext(UserContext).user;
  const [portions, setPortions] = useState(null);
  //Checks where the user navigated from to be able to return to that page when the user clicks back
  const from = props.location.state.from;

  //If the user clcks on increase or decrease portions it calculates whick to show
  //It increases with two except if the recipe is for one person, then it increases with one
  const calculatePortions = (type, port) => {
    if (type === "minus") {
      let newPortions = port % 2 === 0 ? port - 2 : port - 1;
      setPortions(newPortions);
    } else if (type === "plus") {
      setPortions(port % 2 === 0 ? port + 2 : port + 1);
    }
  };

  //This runs everytime the portions is updated, checks if the amount is 0. something, then the calculation is diffirent
  const calculateIngredient = (portions, amount, oldPoritons) => {
    let num = parseInt(amount);
    if (amount.includes(".") && amount.charAt(0) === "0") {
      let twoPlacedFloat = parseFloat(amount).toFixed(2);
      return portions && amount
        ? (twoPlacedFloat * portions) / oldPoritons
        : amount;
    }
    return portions && amount
      ? (num.toFixed(2) / oldPoritons) * portions
      : amount;
  };

  
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
    <div className="postDetail">
      <Navbar />
      <div className="linkback">
        <Link to={from}>Tillbaka</Link>
      </div>
       {/*Maps over the recipes and displays the one with the is that was sent in as prop*/}
      {recipe &&
        recipe.map((recipeItem) => {
          if (recipeItem.id === id) {
            return (
            //The recipe is displayed diffirently depending on if its a type write or type link
              <div key={recipeItem.id} className="postDetail__outerWrap">
                <div
                  className={
                    recipeItem.post.type === "write"
                      ? "postDetail__wrap"
                      : "postDetail__wrap__link"
                  }
                  key={recipeItem.id}
                >
                  {recipeItem.post.type === "link" ? (
                    <div>
                   
                    </div>
                  ) : (
                    <>
                      <div className="titleImageWrapper">
                        <h1 className="postDetail__title">
                          {recipeItem.post.title}
                        </h1>
                        {/* <img
                          className="postDetail__img"
                          src={recipeItem.post.photoUrl}
                        /> */}
                      </div>
                    </>
                  )}
                  {/*For type write it displays poritons that are selected and two buttons, one to decrease and one 
                  to increase, on click the function calculatePortions is run*/}
                  {recipeItem.post.type === "write" ? (
                    <div className="postDetail__ingredients">
                      {recipeItem.post.portions && (
                        <div className="postDeatil__portionsWrap">
                          <span
                            className="postDeatil__portionsDecrease"
                            onClick={(e) =>
                              calculatePortions(
                                "minus",
                                portions
                                  ? portions
                                  : parseInt(recipeItem.post.portions)
                              )
                            }
                          >
                            -
                          </span>
                          <span className="postDeatil__portion">
                            {portions
                              ? portions
                              : parseInt(recipeItem.post.portions)}{" "}
                          </span>
                          <span
                            className="postDeatil__portionsIncrease"
                            onClick={(e) =>
                              calculatePortions(
                                "plus",
                                portions
                                  ? portions
                                  : parseInt(recipeItem.post.portions)
                              )
                            }
                          >
                            +
                          </span>
                        </div>
                      )}
                      {/*Shows the list of ingredients, the amount is beeing calculated in calculateIngredients*/}
                      <p className="heading">Ingredienser:</p>
                      <div className="photoingredients">
                      <ul className="postDetail__ingredientList">
                        {recipeItem.post.ingredientList.map((ingredient, i) => {
                          return (
                              <li
                                key={i}
                                className="postDetail__ingredientItem"
                              >
                                {calculateIngredient(
                                  portions,
                                  ingredient.amount,
                                  recipeItem.post.portions
                                )}
                                 {" "} {ingredient.measure}{" "}{ingredient.ingredient}
                              </li>
                          );
                        })}
                      </ul>
                      <div>
                        <img
                          className="postDetail__img"
                          src={recipeItem.post.photoUrl}
                        />
                        </div>
                      </div>
                      <div className="description">
                        <p className="heading">Beskrivning:</p>
                        <p className="postDetail__description">
                          {recipeItem.post.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="recipe__link">
                      <div className="edit__linkImage">
                        <img
                          className="postDetail__img"
                          src={recipeItem.post.photoUrl}
                          />
                      </div>
                      {/*If the type is link it is displayed difirently. It shows the link to the recipe and also shows 
                      the recipe in an iframe*/}
                      <div>
                        <h1 className="editItem__postTitle">{recipeItem.post.title}</h1>
                        <p className="recipe__linkInstructions">
                          Receptet är nedan, klicka på länken om det inte är synligt
                        </p>
                        <div className="recipe__linkInstructions">
                        <a href={recipeItem.post.link} target="_blank">
                          {recipeItem.post.link}
                        </a>
                        </div>
                        {recipeItem.post.description && (
                          <>
                            <p>Antecklingar</p>
                            <p className="postDetail__notes">{recipeItem.post.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  {/*If the user that is looking at the recipe is the same as the one that created the recepie the edit
                   recipe link is shown*/}
                   <div className="edit__link">
                  {user &&
                  user.email.replace("@gmail.com", "") ===
                    recipeItem.post.username ? (
                    <Link
                      to={{
                        pathname: `/edit-recipe/${id}`,
                        state: { from: from },
                      }}
                    >
                      Redigera recept
                    </Link>
                  ) : (
                    <></>
                  )}
                  </div>
                </div>
                {recipeItem.post.type === "link" && (
                  <div className="frame__div">
                    <iframe src={recipeItem.post.link}></iframe>
                  </div>
                )}
              </div>
            );
          }
        })}
      {recipe &&
        recipe.map((recipeItem) => {
          if (recipeItem.id === id) {
            return (
              //if there are any comments added to the recipe they are shown else not
              <div key={recipeItem.id}
                className="commentswrapper"
                style={{
                  display: !user && !recipeItem.post.comments ? "none" : "flex",
                }}
              >
                <h3>Kommentarer</h3>
                <div className="comments">
                  {/*Maps over the comments and sets the as pops to the comment component*/}
                  {recipeItem.post.comments ? (
                    recipeItem.post.comments.map((comment, index) => (
                      <Comment
                        key={index}
                        username={comment.username}
                        caption={comment.comment}
                        displayName={comment.displayName}
                      />
                    ))
                  ) : (
                    <></>
                  )}
                  {/*If a user is logged in the commentInput component is rendered*/}
                  {user ? (
                    <CommentInput comments={recipeItem.post.comments} id={id} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            );
          }
        })}
    </div>
  );
}
