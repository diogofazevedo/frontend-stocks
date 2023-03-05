import React from "react";
import { Navigate } from "react-router-dom";

import Nav from "./Nav";

function PrivateRoute({ children, access }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role?.accesses?.find((x) => x.name === access) || !access) {
    return (
      <>
        <Nav />
        {children}
      </>
    );
  }

  return <Navigate to="/" />;
}

export default PrivateRoute;
