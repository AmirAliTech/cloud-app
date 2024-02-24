import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyDeleteComponent = ({ itemId, onUpdate }) => {
  const [deleteStatus, setDeleteStatus] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!itemId) {
      console.error("itemId is undefined");
      return;
    }

    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(
          `https://public.lazybluffer.online/itemremove/${itemId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
    
        if (response.ok) {
          setDeleteStatus("Data deleted successfully");
          onUpdate();
          navigate("/find");
          toast.success("Deleted Successfully");
        } else if (response.status === 404) {
          setDeleteStatus("No data found");
        } else {
          setDeleteStatus("Failed to delete data");
        }
      } catch (error) {
        console.error("Error:", error.message);
        setDeleteStatus("Internal Server Error");
      }
    }
  };

  return (
    <div>
      <button onClick={handleDelete} className="updatebtn btn btn-danger text-nowrap">
        Delete Data
      </button>
      {deleteStatus && <p>{deleteStatus}</p>}
    </div>
  );
};

export default MyDeleteComponent;
