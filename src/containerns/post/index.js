import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export default function Post({
  username,
  id,
  photoUrl,
  title
}) {

  //A single post card in the feed 
  return (
    <div className="post">
      <div className="post__header">
        <div className="post__headerLeft"></div>
      </div>
       {/*Link to the detail page for the recipes*/}
      <Link
        className="post__link"
        to={{ pathname: `/recipe/${id}`, state: { from: "/" } }}
      >
        <div
          className="post__center"
          style={{ backgroundImage: `url(${photoUrl})` }}
        ></div>
        <div className="post__title">
          <h2 className="post__">{title}</h2>
        </div>
        <div className="name">
          <span
            style={{ marginRight: "4px", fontSize: "12px", padding: "16px" }}
          >
            By: {username}
          </span>
        </div>
      </Link>
    </div>
  );
}
