import React from "react";
import { Link} from "react-router-dom";
import "../App.css";

const SideComponent = () => {
  return (
    <div className="aside">
      <div
        className=""
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        <i className="fa-solid fa-bars burger cursorpointer"></i>
      </div>

      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabindex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
            
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body flex-column d-flex ">
          <Link to="/" className="btn btn-primary my-1 py-1">Add Data</Link>
          <Link to="/find" className="btn btn-primary my-1 py-1">See and Modify Data</Link>
        </div>
      </div>
    </div>
  );
};

export default SideComponent;
