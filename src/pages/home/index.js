import React from "react";
import "./style.css";
import { Navbar } from "../../containerns";
import Feed from "../../containerns/feed";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      {/*The homepage shows the navbar */}
      <Navbar />
      <div className="home__linkdiv">
           {/*the add new button */}
        <Link className="home__link" to="/new-recipe">
          Add a new recipe <span className="home__linkspan">+</span>
        </Link>
      </div>
         {/*and the feed*/}
      <Feed />
    </div>
  );
}
