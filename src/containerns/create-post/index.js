import React, { useContext, useState, useEffect } from "react";
import "./style.css";
import { SignInBtn } from "../../components";
import { UserContext } from "../../contexts/user";
import { categoryList } from "../feed";
import DeleteIcon from "@material-ui/icons/Delete";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { db, storage } from "../../firebase";
import makeid from "../../helper/functions";
import CreateIcon from "@material-ui/icons/Create";
import LinkIcon from "@material-ui/icons/Link";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import firebase from "firebase";
import { Navbar } from "..";

export default function CreatePost() {
  const [user, setUser] = useContext(UserContext).user;
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [portions, setPortions] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [amount, setAmount] = useState("");
  const [measure, setMeasure] = useState("");
  const [ingredientList, setIngredientList] = useState([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recipeType, setRecipeType] = useState("write");
  const [link, setLink] = useState("");
  const [collectionData, setCollectionData] = useState([]);
  const [collection, setCollection] = useState("");

  let ingredientItem;

  const handleChange = (e) => {
    //If the user selects a new image it is displayed as a preview, if no imgage is selected the preview is display:none
    if (e.target.files[0]) {
      setImage(e.target.files[0]);

      var selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      var imagePreview = document.getElementById("image-preview");
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
    }
  };

  //The function that handles adding new ingredients. It takes all the input for one ingredient and adds it to a list.
  // it also includes the previous items in that list not to overwrite them
  function handleSubmitIngredient() {
    ingredientItem = {
      ingredient: ingredient,
      amount: amount,
      measure: measure,
    };
    setIngredientList((prevState) => {
      return [...prevState, ingredientItem];
    });

    setIngredient("");
    setAmount("");
    setMeasure("");
  }

  //Deletes an ingredient from the list, checks for the content of the ingredient that was clicked and removes it from 
  //the list
  const deleteIngredient = (e) => {
    const name = e.target.parentElement.parentElement.innerText;
    const ingr = name.split(" ");
    setIngredientList(
      ingredientList.filter((item) => item.ingredient !== ingr[0])
    );
    if (ingredientList.length === 1) {
      setIngredientList([]);
    }
  };

  //The function that handles the upload of a new recipe, it is divided in three parts for the difirent possible scenarios
  // Write recipe with image, write recipe without image and link recipe
  const handleUpload = () => {
    //First one checks if an image is added (then it is a write recipe because I didnt add that functionallity to link)
    if (image) {
      //Creates an image name using the helper function makeid, uploads the image with the new name
      var imageName = makeid(10);
      const uploadTask = storage.ref(`images/${imageName}.jpg`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          // this function is run when the image is uploaded, it gets the images downoald url and uploads the recipe
          //To the db collection posts with all the data that the user entered and sets a timestamp
          storage
            .ref("images")
            .child(`${imageName}.jpg`)
            .getDownloadURL()
            .then((imageUrl) => {
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                title: title,
                ingredientList: ingredientList,
                description: description,
                photoUrl: imageUrl,
                type: recipeType,
                userCategory: collection ? collection : "Unsorted",
                userCategorySlug: collection
                  ? collection.replace(" ", "").replace("å", "a").replace("ä", "a").replace("ö", "o").toLowerCase()
                  : "unsorted",
                category: category,
                public: isPublic,
                portions: portions,
                username: user.email.replace("@gmail.com", ""),
                profileUrl: user.photoURL,
              });
              setDescription("");
              setProgress(0);
              setTitle("");
              setIngredientList([]);
              setImage(null);
              setPortions("");
              setIsPublic(true);
            });
          document.getElementById("image-preview").style.display = "none";
        }
      );
    }
    //This is the second option, type is write and no image is added. This uploads the recipe right away to the db
    //collection posts with all the data that the user entered and sets a timestamp, adds default image that is already
    //uploaded
    if (!image && recipeType === "write") {
      db.collection("posts").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        title: title,
        ingredientList: ingredientList,
        description: description,
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/recipely-8c1d4.appspot.com/o/images%2Fno-image.png?alt=media&token=4c3d70b2-c03c-4f5d-8be3-5513c78aef03",
        type: recipeType,
        userCategory: collection ? collection : "Unsorted",
        userCategorySlug: collection
          ? collection.replace(" ", "").replace("å", "a").replace("ä", "a").replace("ö", "o").toLowerCase()
          : "unsorted",
        category: category,
        public: isPublic,
        portions: portions,
        username: user.email.replace("@gmail.com", ""),
        profileUrl: user.photoURL,
      });
      setDescription("");
      setProgress(0);
      setTitle("");
      setIngredientList([]);
      setPortions("");
      setIsPublic(true);
    }
    //This is the third option, type is link. This also uploads the recipe right away to the db. The difference is that
    //it is not the same data that is beeing uploaded, it adds default image
    if (recipeType === "link") {
      db.collection("posts").add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        title: title,
        link: link,
        photoUrl:
          "https://firebasestorage.googleapis.com/v0/b/recipely-8c1d4.appspot.com/o/images%2Fno-image.png?alt=media&token=4c3d70b2-c03c-4f5d-8be3-5513c78aef03",
        type: recipeType,
        description: description,
        userCategory: collection ? collection : "Unsorted",
        userCategorySlug: collection
          ? collection.replace(" ", "").replace("å", "a").replace("ä", "a").replace("ö", "o").toLowerCase()
          : "unsorted",
        category: category,
        public: isPublic,
        username: user.email.replace("@gmail.com", ""),
        profileUrl: user.photoURL,
      });
      setLink("");
      setTitle("");
      setDescription("");
      setPortions("");
      setIsPublic(true);
    }
  };

  //Gets the userCategories/user collections that this user created
  useEffect(() => {
    db.collection("categories").onSnapshot((snapshot) => {
      setCollectionData(
        snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
      );
    });
  }, []);

  return (
    <div className="outerWrap">
      <Navbar />
      <div className="createPost">
        {/* Checks if there is a user in context. Only logged in users can add recipes */}
        {user && (
          <div className="btn__wrapper">
            {/*2 buttons so the user can decide to upload a write recipe or a link */}
            <button
              value="write"
              onClick={(e) => setRecipeType("write")}
              className="outerWrap__btn"
              style={{
                backgroundColor: recipeType === "write" ? "white" : "#f8f8f8",
                boxShadow:
                  recipeType === "write"
                    ? "0px -3px 5px 0px rgba(189, 189, 189, 0.75)"
                    : "none",
              }}
            >
              <CreateIcon style={{ fontSize: "35px" }} />
            </button>
            <button
              value="link"
              onClick={(e) => setRecipeType("link")}
              className="outerWrap__btn"
              style={{
                backgroundColor: recipeType === "link" ? "white" : "#f8f8f8",
                boxShadow:
                  recipeType === "link"
                    ? "0px -3px 5px 0px rgba(189, 189, 189, 0.75)"
                    : "none",
              }}
            >
              <LinkIcon style={{ fontSize: "35px" }} />
            </button>
          </div>
        )}
        {user ? (
          <div className="createPost__loggedIn">
            <h1>New recipe</h1>
            {/* If the user has selected to add a recipe with type write this form is shown */}
            {recipeType === "write" ? (
              <div>
                <div className="createPost__inputwrapper">
                  <label htmlFor="title">Recepie name</label>
                  <input
                    required
                    type="text"
                    name="title"
                    value={title}
                    onInput={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                  <label className="selectLabel" htmlFor="collection">
                    Choose a collection:
                  </label>
                  {/* If the user has added userCategories/user collections thay can select one here, otherwise it gets
                   added in unsorted*/}
                  <select
                    name="collection"
                    value={collection ? collection : "Unsorted"}
                    onChange={(e) => setCollection(e.target.value)}
                  >
                    {collectionData &&
                      collectionData.map((coll) => {
                        if (
                          coll.post.username ===
                          user.email.replace("@gmail.com", "")
                        ) {
                          return (
                            <option key={coll.id} value={coll.post.category}>
                              {coll.post.category}
                            </option>
                          );
                        }
                        // else {
                        //   return (
                        //       <option value="Unsorted">Unsorted</option>
                        //   )
                        // }
                      })}
                  </select>
                  <label className="selectLabel2" htmlFor="category">
                    Choose a category:
                  </label>
                    {/* The user can select a category for the recepie */}
                  <select
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="X"></option>
                    {categoryList.map((categoryItem) => {
                      return (
                        categoryItem.name !== "X" && (
                          <option
                            key={categoryItem.id}
                            value={categoryItem.name}
                          >
                            {categoryItem.name}
                          </option>
                        )
                      );
                    })}
                  </select>
                    {/* The user can select if the recipe is public or private*/}
                  <div className="radio">
                    <label htmlFor="public">Public</label>
                    <input
                      type="radio"
                      name="public"
                      onChange={(e) => setIsPublic(true)}
                      checked={isPublic}
                    />
                    <label htmlFor="private">Private</label>
                    <input
                      type="radio"
                      name="private"
                      onChange={(e) => setIsPublic(false)}
                      checked={!isPublic}
                    />
                  </div>
                    {/* The user can assign how many portions the reeipe is for*/}
                  <div className="portions">
                    <label className="portionsLabel">Portions</label>
                    <br />
                    <input
                      type="number"
                      name="portions"
                      min="0"
                      className="edit__inputSmaller"
                      value={portions}
                      onInput={(e) => setPortions(e.target.value)}
                    />
                  </div>
                    {/* Shows a list of the added ingredients*/}
                  <div>
                    {ingredientList &&
                      ingredientList.map((ingredient) => {
                        return (
                          <p key={ingredient.ingredient}>
                            {ingredient.ingredient} {ingredient.amount}{" "}
                            {ingredient.measure}{" "}
                            <DeleteIcon
                              className="edit__deleteIngredientBtn"
                              onClick={deleteIngredient}
                            />
                          </p>
                        );
                      })}
                  </div>
                    {/* Three input fields for adding a new ingredient, ingredient, amount and measure*/}
                  <div className="createPost__ingredientwrapper">
                    <div>
                      <label htmlFor="ingredient">Ingredient</label>
                      <input
                        type="text"
                        name="ingredient"
                        value={ingredient}
                        onInput={(e) => setIngredient(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="amount">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        min="0"
                        className="edit__inputSmaller"
                        value={amount}
                        onInput={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="measure">Measure</label>
                      <input
                        type="text"
                        name="measure"
                        value={measure}
                        onInput={(e) => setMeasure(e.target.value)}
                      />
                    </div>
                      {/*When the user clicks add button the function handleSubmitIngredient is run to add ingredient 
                      to the list */}
                    <div className="createPost__ingredientSubmit">
                      <label>Add</label>
                      <button
                        className="createPost__ingredientSubmitBtn"
                        onClick={handleSubmitIngredient}
                      >
                        <AddCircleIcon />
                      </button>
                    </div>
                  </div>
                </div>
                {/*The user can add a description*/}
                <div className="createPost_loggedInCenter">
                  <label>Description</label>
                  <textarea
                    required
                    className="createPost__textarea"
                    rows="3"
                    placeholder="enter description here..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  {/*If the user selects an image the preview is shown here*/}
                  <div className="createPost__imagePreview">
                    <img id="image-preview" alt="" />
                  </div>
                </div>
                {/*The user can add an image, the function handleChange is run on upload and shows a preview of the 
                image*/}
                <div className="createPost__loggedInBottom">
                  <div className="createPost__imageUpload">
                    <label htmlFor="fileInput">
                      <AddAPhotoIcon
                        style={{ cursor: "pointer", fontSize: "30px" }}
                      />
                    </label>
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                  {/*Upload button, this runs the functions that adds the recipe to the database */}
                  <button
                    className="createPost__uploadBtn"
                    onClick={handleUpload}
                    disabled={
                      title != "" &&
                      description != "" &&
                      ingredientList.length > 0
                        ? false
                        : true
                    }
                    // style={{ color: description ? "#000" : "lightgrey" }}
                  >
                    Upload
                  </button>
                </div>
              </div>
            ) : (
              <div>
                 {/* If the user has selected to add a recipe with type link this form is shown */}
                <div>
                  <label>Recipe title</label>
                  <input
                    className="textInput"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                  {/* This is where the user pastes the link to the recipe*/}
                <div>
                  <label>Paste a link here</label>
                  <input
                    required
                    className="textInput"
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
                  {/* If the user has added userCategories/user collections thay can select one here, otherwise it gets
                   added in unsorted*/}
                <label className="selectLabel" htmlFor="collection">
                  Choose a collection:
                </label>
                <select
                  name="collection"
                  value={collection ? collection : "Unsorted"}
                  onChange={(e) => setCollection(e.target.value)}
                >
                  {collectionData &&
                    collectionData.map((coll) => {
                      if (
                        coll.post.username ===
                        user.email.replace("@gmail.com", "")
                      ) {
                        return (
                          <option value={coll.post.category}>
                            {coll.post.category}
                          </option>
                        );
                      }
                      // else {
                      //     return (
                      //         <option value="Unsorted">Unsorted</option>
                      //     )
                      // }
                    })}
                </select>
                  {/* The user can select a category for the recepie */}
                <div className="selectLabel">
                  <label className="selectLabel" htmlFor="category">
                    Choose a category:
                  </label>
                  <select
                    name="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="X"></option>
                    {categoryList.map((categoryItem) => {
                      return (
                        categoryItem.name !== "X" && (
                          <option value={categoryItem.name}>
                            {categoryItem.name}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>
                 {/* The user can select if the recipe is public or private*/}
                <div className="radio2">
                  <label htmlFor="public">Public</label>
                  <input
                    type="radio"
                    name="public"
                    onChange={(e) => setIsPublic(true)}
                    checked={isPublic}
                  />
                  <label htmlFor="private">Private</label>
                  <input
                    type="radio"
                    name="private"
                    onChange={(e) => setIsPublic(false)}
                    checked={!isPublic}
                  />
                </div>
                 {/* The user can add some notes about the recipe */}
                <label>Notes</label>
                <textarea
                  className="createPost__textarea"
                  rows="3"
                  placeholder="enter notes here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <div className="uploadbutton">
                  <button
                    className="createPost__uploadBtn"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
             {/* If the user is not logged in the sign in button is shown*/}
            <SignInBtn />
            <p style={{ marginLeft: "12px" }}>to Post and Comment</p>
          </div>
        )}
      </div>
    </div>
  );
}
