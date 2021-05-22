import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "..";
import { UserContext } from "../../contexts/user";
import "./style.css";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import DeleteIcon from "@material-ui/icons/Delete";
import { db, storage } from "../../firebase";
import firebase from "firebase";
import makeid from "../../helper/functions";
import { categoryList } from "../feed";
import { Link, useHistory } from "react-router-dom";

export default function EditPost(props) {
  const id = props.match.params.id;
  const [user, setUser] = useContext(UserContext).user;
  const [recipe, setRecipe] = useContext(UserContext).recipe;
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [collection, setCollection] = useState(null);
  const [isPublic, setIsPublic] = useState(null);
  const [portions, setPortions] = useState("");
  const [ingredient, setIngredient] = useState(null);
  const [amount, setAmount] = useState(null);
  const [measure, setMeasure] = useState(null);
  const [ingredientList, setIngredientList] = useState([]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [updateList, setUpdateList] = useState();
  const [collectionData, setCollectionData] = useState([]);
  const [link, setLink] = useState("");
  const [recipeType, setRecipeType] = useState("");
  const [newImage, setNewImage] = useState(null);
  //This variable is used for navigation backwards
  const from = props.location.state.from
    ? props.location.state.from
    : "/profile";
  let ingredientItem;
  let history = useHistory();
  const userCollectionArray = [];

  const handleChange = (e) => {
    //If the user selects a new image it is displayed as a preview
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };
  
  //The function that handles the update of a existing, As in the createnew post it is divided in three parts for the 
  // difirent possible scenarios, write recipe with image, write recipe without image and link recipe
  const handleChangeUpload = () => {
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
          // this function is run when the image is uploaded, it gets the images downoald url and uses the recipes unique 
          //id to update the databaseb with all the data that the user entered
          storage
            .ref("images")
            .child(`${imageName}.jpg`)
            .getDownloadURL()
            .then((imageUrl) => {
              db.collection("posts").doc(`${id}`).update({
                title: title,
                ingredientList: ingredientList,
                description: description,
                photoUrl: imageUrl,
                userCategory: collection ? collection : "Unsorted",
                userCategorySlug: collection
                  ? collection.replace(" ", "").replace("å", "a").replace("ä", "a").replace("ö", "o").toLowerCase()
                  : "unsorted",
                category: category,
                public: isPublic,
                portions: portions,
              });
              setDescription("");
              setProgress(0);
              setTitle("");
              setIngredientList([]);
              setImage(null);
              setPortions("");
              setIsPublic(true);
            });
        }
      );
    }
    //This is the second option, type is write and no image is added. This updated the recipe right away to the db with 
    //the unique id
    if (recipeType === "write" && !image) {
      db.collection("posts")
        .doc(`${id}`)
        .update({
          title: title,
          ingredientList: updateList,
          description: description,
          userCategory: collection ? collection : "Unsorted",
          userCategorySlug: collection
            ? collection.replace(" ", "").replace("å", "a").replace("ä", "a").replace("ö", "o").toLowerCase()
            : "unsorted",
          category: category,
          public: isPublic,
          portions: portions,
        });
    }
    //This is the third option, type is link. This also updates the recipe right away to the db using the unique id
    if (recipeType === "link") {
      db.collection("posts")
        .doc(`${id}`)
        .update({
          title: title,
          link: link,
          description: description,
          userCategory: collection ? collection : "Unsorted",
          userCategorySlug: collection
            ? collection.replace(" ", "").replace("å", "a").replace("ä", "a").replace("ö", "o").toLowerCase()
            : "unsorted",
          category: category,
          public: isPublic,
        });
    }
    history.push({
      pathname: `/recipe/${id}`,
      state: { from: from },
    });
  };

  //The function that handles adding new ingredients. It takes all the input for one ingredient and adds it to a list.
  // it also includes the previous items in that list not to overwrite them
  const handleSubmitIngredient = () => {
    ingredientItem = {
      measure: measure,
      ingredient: ingredient,
      amount: amount,
    };
    setUpdateList((prevState) => {
      return [...prevState, ingredientItem];
    });
    console.log(updateList);
    setIngredient("");
    setAmount("");
    setMeasure("");
  };
  //Deletes an ingredient from the list, checks for the content of the ingredient that was clicked and removes it from 
  //the list
  const deleteIngredient = (e) => {
    const name = e.target.parentElement.parentElement.innerText;
    const ingr = name.split(" ");
    setUpdateList(updateList.filter((item) => item.ingredient !== ingr[0]));
  };

  //This useEffect runs right away. It uses the id provided as a prop to get the right recipeand checks what type of 
  //recipe it is. It sets all the data to state variables that are displayed as value in inputfields. It also gets the 
  //userCategories/ usercollections from the database
  useEffect(() => {
    console.log(from);
    recipe.map((recipeItem) => {
      if (
        recipeItem.id === id &&
        user.email.replace("@gmail.com", "") === recipeItem.post.username &&
        recipeItem.post.type === "write"
      ) {
        setTitle(recipeItem.post.title);
        setDescription(recipeItem.post.description);
        setIngredientList(recipeItem.post.ingredientList);
        setUpdateList(recipeItem.post.ingredientList);
        setImagePreview(recipeItem.post.photoUrl);
        setCollection(recipeItem.post.userCategory);
        setCategory(recipeItem.post.category);
        setPortions(recipeItem.post.portions);
        setIsPublic(recipeItem.post.public);
        setRecipeType("write");
      }
      if (
        recipeItem.id === id &&
        user.email.replace("@gmail.com", "") === recipeItem.post.username &&
        recipeItem.post.type === "link"
      ) {
        setLink(recipeItem.post.link);
        setCategory(recipeItem.post.category);
        setCollection(recipeItem.post.userCategory);
        setTitle(recipeItem.post.title);
        setDescription(recipeItem.post.description);
        setIsPublic(recipeItem.post.public);
        setRecipeType("link");
      }
    });
    db.collection("categories").onSnapshot((snapshot) => {
      setCollectionData(
        snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
      );
    });
  }, []);

  return (
    <div className="edit">
      <Navbar />
      <Link to={{ pathname: `/recipe/${id}`, state: { from: from } }}>
        Back
      </Link>
         {/* Checks if there is a user in context. Only logged in users can edit recipes */}
      {user ? (
        <div className="edit__outerWrapper">
             {/* If the type is write the edit form is displayed in one way, and the form works the same way as create-post */}
          {recipeType === "write" ? (
            <div className="edit__post">
              <h1>Edit recipe</h1>
              <p>Recipe title</p>
              <input
                value={title && title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="collection">Choose a collection:</label>
                 {/*User can change collection for the recipe, then it will be shown in that collection in the profile */}
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
                      userCollectionArray.push(coll.post.category);
                      return (
                        <option value={coll.post.category}>
                          {coll.post.category}
                        </option>
                      );
                    }
                  })}
              </select>
              <label htmlFor="category">Choose a category:</label>
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
              <div>
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
              <div>
                <label>Portions</label>
                <input
                  type="number"
                  name="portions"
                  min="0"
                  className="edit__inputSmaller"
                  value={portions}
                  onInput={(e) => setPortions(e.target.value)}
                />
              </div>
              <p className="edit__text">Ingredients</p>
              <ul>
                   {/*maps over the exsisting ingredients, user can remove ingridients*/}
                {updateList &&
                  updateList.map((ingredientItem, i) => {
                    return (
                      <li className="edit__listItem" key={i}>
                        {ingredientItem.ingredient} {ingredientItem.amount}{" "}
                        {ingredientItem.measure}{" "}
                        <DeleteIcon
                          className="edit__deleteIngredientBtn"
                          onClick={deleteIngredient}
                        />
                      </li>
                    );
                  })}
              </ul>
              <p className="edit__text">Add new ingredient</p>
              <div className="edit__addIngredient">
                <div>
                  <label>Ingredient</label>
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                  />
                </div>
                <div>
                  <label>Amount</label>
                  <input
                    value={amount}
                    className="edit__inputSmaller"
                    type="text"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label>Measure</label>
                  <input
                    value={measure}
                    type="text"
                    onChange={(e) => setMeasure(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSubmitIngredient}
                  className="edit__ingredientSubmitBtn"
                >
                  <AddCircleIcon />
                </button>
              </div>
              <p>Description</p>
              <textarea
                className="edit__textarea"
                value={description && description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <div className="edit__imagePreview">
                <img
                  id="image-edit-preview"
                  alt=""
                  src={imagePreview ? imagePreview : ""}
                />
              </div>
              <div className="createPost__imageUpload">
                <label htmlFor="fileInput">
                  {" "}
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
              <button
                className="createPost__uploadBtn"
                onClick={handleChangeUpload}
              >
                Upload
              </button>
            </div>
          ) : (
               //if the type is link another form is displayed
            <div className="edit__post">
              <h1>Edit recipe</h1>
              <p>Recipe title</p>
              <input
                value={title && title}
                type="text"
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                value={link && link}
                type="text"
                onChange={(e) => setLink(e.target.value)}
              />
              <label htmlFor="collection">Choose a collection:</label>
                 {/*User can change collection for the recipe, then it will be shown in that collection in the profile */}
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
                      userCollectionArray.push(coll.post.category);
                      return (
                        <option value={coll.post.category}>
                          {coll.post.category}
                        </option>
                      );
                    }
                  })}
              </select>
              <label htmlFor="category">Choose a category:</label>
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
              <div>
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

              <p>Description</p>
              <textarea
                className="edit__textarea"
                value={description && description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <div className="edit__imagePreview">
                <img
                  id="image-edit-preview"
                  alt=""
                  src={imagePreview ? imagePreview : ""}
                />
              </div>
              {/* <div className="createPost__imageUpload">
            <label htmlFor="fileInput"> <AddAPhotoIcon style={{cursor:"pointer", fontSize:"30px"}}/></label>
            <input id="fileInput" type="file" accept="image/*" onChange={handleChange} />
          </div> */}
              <button
                className="createPost__uploadBtn"
                onClick={handleChangeUpload}
              >
                Upload
              </button>
            </div>
          )}
        </div>
      ) : (
        <>{history.push("/")}</>
      )}
    </div>
  );
}
