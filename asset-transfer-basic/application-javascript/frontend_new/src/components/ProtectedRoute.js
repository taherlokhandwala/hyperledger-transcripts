import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const userLogin = localStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={(props) => {
        return typeof userLogin !== "undefined" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        );
      }}
    ></Route>
  );
};

export default ProtectedRoute;
