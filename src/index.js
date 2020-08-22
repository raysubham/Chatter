import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import firebase from "firebase";
import "firebase/firestore";
import Login from "./login/login";
import Signup from "./signup/signup";
import Dashboard from "./dashboard/dashboard";

firebase.initializeApp({
  apiKey: "AIzaSyB15oeLj7VNbORMUVxXlgDlTnObv1swhXk",
  authDomain: "chatter-00.firebaseapp.com",
  databaseURL: "https://chatter-00.firebaseio.com",
  projectId: "chatter-00",
  storageBucket: "chatter-00.appspot.com",
  messagingSenderId: "1008718892813",
  appId: "1:1008718892813:web:39ebcf30b337030e52aa44",
  measurementId: "G-GEDRQ5KRDS",
});

const routing = (
  <Router>
    <div id="route-container">
      <Route path="/login" component={Login} />
      <Route path="/" redirect="/login" />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Redirect from="/" exact to="/login"></Redirect>
    </div>
  </Router>
);

ReactDOM.render(
  <React.StrictMode>{routing}</React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
