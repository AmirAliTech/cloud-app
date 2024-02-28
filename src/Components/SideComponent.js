import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const SideComponent = () => {
  return (

    <div className="d-flex flex-column w-15 h-100 ">
      <Link to="/" className="btn btn-primary ">Add Data</Link>
      <Link to="/find" className="btn btn-primary ">See and Modify Data</Link>
    </div>
  );
};

export default SideComponent;
