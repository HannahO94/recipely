import React from 'react'

export default function Comment({username, caption, displayName}) {
  //Comment component displays the comment, props are beeing sent from post-detail
    return (
        <div className="comment">
             <p style={{padding: "6px"}}>
                 <span style={{fontWeight:"bold", marginRight:"4px", padding: "16px"}}>{displayName}</span>
                 {caption}
            </p>
        </div>
    )
}
