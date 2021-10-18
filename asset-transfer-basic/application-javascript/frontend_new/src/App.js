import React from "react";
import "./styles/App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Transcript from "./components/Transcript";
import AdminUpload from "./components/AdminUpload";
import AdminView from "./components/AdminView";
import Verify from "./components/Verify";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Header />
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/admin" exact component={AdminUpload} />
        <Route path="/admin/view" exact component={AdminView} />
        <Route path="/verify" exact component={Verify} />
        <ProtectedRoute path="/transcript" exact component={Transcript} />
      </Router>
    </div>
  );
};

export default App;
