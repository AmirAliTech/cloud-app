import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideComponent from "./SideComponent";

const SingleNews = () => {
    const { newsid } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token not found");
                }
                if (!newsid) {
                    throw new Error("News ID not provided");
                }
                const response = await fetch(`https://public.lazybluffer.online/findOne/${newsid}`, {
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
    }, [newsid]);

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

    return (
        <>
            <SideComponent />
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="container">
                        <div className="row">
                            <div className="col-10">
                                <img src={`https://public.lazybluffer.online/${data.nfile}`} alt="Not Found" />
                                <h1>Trending</h1>
                                <p>{data.trending ? (<div>true</div>) : (<div>false</div>)}</p>
                                <h1>Title</h1>
                                <p>{data.title}</p>
                                <h1>Category</h1>
                                <p>{data.category ? (<div>data.category</div>) : (<div>no category define</div>)}</p>
                                <h1>Description</h1>
                                <p>{data.desc}</p>
                                <h1>Content</h1>
                                <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {!localStorage.getItem("token") && navigate('/login')}
        </>
    );
};

export default SingleNews;
