import React from "react";
import { Navigate } from "react-router-dom";

function Home() {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container-fluid p-4">
      <h3 className="mb-3 ps-1">Página inicial</h3>
    </div>
  );
}

export default Home;
