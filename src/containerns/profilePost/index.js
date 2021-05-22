import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/user'
import { db, storage } from '../../firebase'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import "./style.css"


export default function ProfilePost({ username, id, photoUrl, title }) {
  const [user, setUser] = useContext(UserContext).user
 
  //deletes the recipe from the post colleciton in the database
  const deletePost = () => {      
    var imageRef = storage.refFromURL(photoUrl)
    //if the image is the default/placeholder image it does not delete it. It only deletes the post with that id 
    //from the database
    if(imageRef._delegate._location.path_ === "images/no-image.png") {
        db.collection("posts").doc(id).delete().then(function(){
            console.log("delete post info successful")
        }).catch(function(error){
            console.log(error)
        })
    }             
    else {
      //if there is an image it deletes image from firebase storage and then deletes the recipe from the database
      imageRef.delete()
      .then(function(){
      console.log("delete successful")
      }).catch(function(error){
        console.log(error)
      })
      db.collection("posts").doc(id).delete()
      .then(function(){
          console.log("delete post info successful")
      }).catch(function(error){
          console.log(error)
      })
    }
  }

  return (
    //Shows a recipe card with title, image and buttons, it is a link to detalpage for the recipe
    <div className="profilePost">
      <div className="profilePost__header">
        <div className="profilePost__headerLeft">
        </div>
       {/*The user can click on the delete icon to delete an image */}
        {user && user.email.replace("@gmail.com", "") === username ? <button onClick={deletePost} className="post__delete"><DeleteIcon className="delete-icon"></DeleteIcon></button> : <></>}
      </div>
      <Link className="profilePost__link" to={{pathname: `/recipe/${id}`, state:{ from: "/profile"}}}>
        <div className="profilePost__center" style={{backgroundImage: `url(${photoUrl})`}}>
        </div>
        <div className="profilePost__title">
          <h2 className="profilePost__heading">{title}</h2>
        </div>
      </Link>
      <div className="editIconWrapper">
      {/*Link to the edit recipe page, send the recipes id as a prop in the URL */}
      <Link to={{pathname: `/edit-recipe/${id}`, state:{ from: "/profile"}}}><EditIcon className="edit-icon"></EditIcon></Link>
     </div>
      
    </div>
  )
}