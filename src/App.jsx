import Feeds from "./components/Feeds";
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthProvider";
import { useContext } from "react";
import Profile from "./components/Profile";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <Header></Header>
          <Switch>
            <Route path="/login" exact component={Login}></Route>
            <Route path="/signup" exact component={Signup}></Route>
            {/* my local comaponent with props also it is inside context.provider, than it can use useContext*/}
            <PrivateRoute path="/profile" comp={Profile}></PrivateRoute>
            <PrivateRoute path="/" comp={Feeds}></PrivateRoute>{" "}
          </Switch>
        </Router>
      </AuthProvider>
    </>
  );
};

function PrivateRoute(props) {
  console.log(props);
  let { comp: Component, path } = props; // object destructring , also comp is renamed as Component
  let { currentUser } = useContext(AuthContext); // object destructring
  // user true than return route with path or redirect to login page
  return currentUser ? (
    <Route exact path={path} component={Component}></Route>
  ) : (
    <Redirect to="login"></Redirect>
  );
}

export default App;
