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

  useEffect(() => {
    const fetchToken = async () => {
      const navigatetoken = localStorage.getItem("token");
      try {
        const response = await fetch('http://localhost:3001/gettoken', {
          headers: {
            Authorization: navigatetoken,
          },
        });
        if (!response.ok) {
          console.log('Failed to fetch token');
          navigate('/login');
        }
        const data = await response.text();
        console.log('Token verification response:', data);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, [navigate]);

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
              <div className="container my-3">
                <div className="row">
                  {data.map((item) => (
                    <div key={item._id} className="col ">
                      <div className="  border-1 card" style={{ width: "18rem" }}>
                        <img src={`https://public.lazybluffer.online/${item.nfile}`} className=""  alt={item.title} />
                        <div className="card-body">
                          <h5 className="d-flex align-items-center ">
                            Trending: {item.trending ? (<div className="text-primary">true</div>) : (<div className="text-danger">false</div>)}
                          </h5>
                          <h5 >
                            Category: {item.category ? (<div className="text-primary">{item.category}</div>) : (<div className="text-danger">no Category define</div>)}
                          </h5>
                          <h5 className="card-title">{item.title}</h5>
                          <p className="card-text">{item.desc}</p>
                          <Link to={`/update/${item._id}`} className="btn btn-primary my-1 mx-1  ">update</Link>
                          <Link to={`/singlenews/${item._id}`} className="btn btn-primary my-1 ">view</Link>
                          <MyDeleteComponent itemId={item._id} onUpdate={handleUpdate} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
