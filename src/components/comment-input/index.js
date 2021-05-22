import React, { useContext, useState } from 'react'
import { UserContext } from '../../contexts/user'
import { db } from '../../firebase'
import "./style.css"

export default function CommentInput({comments, id}) {
    const [comment, setComment] = useState("")
    const [user, setUser] = useContext(UserContext).user
    const [commentArray, setCommentArray] = useState(comments ? comments : [])

    
    const addComment = () => {
        //When a user adds a comment on a recipe that recipe is beeing updated in the database with that comment
        //Saves the username of the person who commented and the comment text
        if(comment != ""){
            commentArray.push({
                comment: comment,
                username: user.email.replace("@gmail.com", "").toLowerCase(),
                displayName: user.displayName
            })

            db.collection("posts").doc(id).update({comments: commentArray})
            .then(function() {
                setComment("")
            })
            .catch(function(error) {
                console.log(`Error ${error}`)
            })
        }
    }

    return (
        <div className="commentInput">
              {/*Displays a text are to leave a comment */}
           <textarea rows="1" className="commentInput__textarea" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Skriv en kommentar.."></textarea>
            <button onClick={addComment} className="commentInput__btn">Kommentera</button> 
        </div>
    )
}
