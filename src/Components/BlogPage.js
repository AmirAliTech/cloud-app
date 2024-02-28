import React, { useEffect, useState } from "react";
import SideComponent from "./SideComponent";

const BlogPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Error:", error.message);
        setError("Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  

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
              <section className="d-flex justify-content-center flex-column align-items-center ">
                {data.map((item) => (
                  <div className="w-75">
                    <img
                      src={`https://public.lazybluffer.online/${item.nfile}`}
                      alt="img"
                    />
                    <h4>{item.name}</h4>
                    <div dangerouslySetInnerHTML={{ __html: item.message }}></div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </>
      ) : (
        <p>401 forbidden</p>
      )}
    </>
  );
};

export default BlogPage;
