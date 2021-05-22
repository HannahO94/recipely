import { Route, Switch } from "react-router-dom";
import "./App.css";
import { CategoryDetail, CreateCategory, CreatePost, EditPost, PostDetail, Profile } from "./containerns";
import { UserContextProvider } from "./contexts/user";
import { Home } from "./pages";

function App() {
  //App.js only contains the routes to the other pages,, the component Home is displayed as first component
  //In App.js all the components are wrapped in the userContextProvider, that gives the hole application access to context
  return (
    <UserContextProvider>
      <Switch>
        <Route path="/recipe/:id" component={PostDetail} />
        <Route path="/edit-recipe/:id" component={EditPost} />
        <Route path="/profile/:id" component={CategoryDetail} />
        <Route path="/new-category" component={CreateCategory} />
        <Route path="/profile" component={Profile} />
        <Route path="/new-recipe" component={CreatePost} />
        <Route path="/" component={Home} />
      </Switch>
    </UserContextProvider>
  );
}

export default App;
