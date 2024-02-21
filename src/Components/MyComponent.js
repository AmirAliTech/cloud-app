import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import MyDeleteComponent from "./MyDeleteComponent";
import SideComponent from "./SideComponent";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await fetch("https://public.lazybluffer.online/findAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
        const expirationTime = 60 * 60000;
        setTimeout(() => {
          localStorage.removeItem("token");
        }, expirationTime);
      } catch (error) {
        console.error("Error:", error.message);
        setError("Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldUpdate]); 

  const handleUpdate = () => {
    setShouldUpdate(!shouldUpdate);
  };

  return (
    <>
      {localStorage.getItem("token") ? (
        <>
          <SideComponent />
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <ul>
                {data.map((item) => (
                  <li key={item._id} className="list d-flex flex-column">
                    <p>
                      <strong>Title:</strong> {item.title} <hr /> <strong>Description:</strong>
                      {item.desc} <hr/> <strong>Email:</strong> {item.email}<hr/>
                      <strong>Content:</strong> <hr/> <div dangerouslySetInnerHTML={{ __html: item.content }}></div> <hr className=""/>
                      <strong>Date:</strong> {item.date}
                    </p>
                    <hr/>
                    <img
                      src={`https://public.lazybluffer.online/${item.nfile}`}
                      alt="img"
                      className="cimage"
                    />
                    <hr/>
                    <div className="updateDelete d-flex justify-content-start w-100 ">
                      <MyDeleteComponent
                        itemId={item._id}
                        onUpdate={handleUpdate} 
                      />
                      <Link
                        to={`/update/${item._id}`}
                        className="updatebtn1 btn btn-primary text-nowrap "
                      >
                        Update
                      </Link>
                    </div>
                    <hr/>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        navigate('/login')
      )}
    </>
  );
};

export default MyComponent;
