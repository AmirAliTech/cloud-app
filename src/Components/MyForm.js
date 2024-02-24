import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideComponent from "./SideComponent";
import JoditEditor from 'jodit-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyForm = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    desc: "",
    email: "",
    trending: false,
    nfile: null,
  });

  useEffect(() => {
    const navigatetoken = localStorage.getItem("token");
    if (!navigatetoken) {
      navigate('/login');
    }
  }, [navigate]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset this form?')) {
      setFormData({
        title: "",
        category: "",
        desc: "",
        email: "",
        trending: false,
        nfile: null,
      });
      setContent("");
      toast.success('Form reset successfully');
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("desc", formData.desc);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("trending", formData.trending);
      formDataToSend.append("content", content);
      formDataToSend.append("nfile", formData.nfile);

      const response = await fetch("https://public.lazybluffer.online/enterdata", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Data saved successfully");
        setFormData({
          title: "",
          category: "",
          desc: "",
          email: "",
          trending: false,
          nfile: null,
        });
        setContent("");
        toast.success("Data submitted successfully");
        const expirationTime = 60 * 60000;
        setTimeout(() => {
          localStorage.removeItem("token");
        }, expirationTime);
        navigate("/find");
      } else {
        console.error("Failed to save data");
        toast.error('Failed to save data');
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Something went wrong while submitting data");
    }
  };

  return (
    <>
      <SideComponent />
      <div className="form">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="trending" className="w-100 d-flex align-items-center">
            Trending
            <input type="checkbox" id="trending" name="trending" className="trending-box" checked={formData.trending} onChange={handleChange} />
            {console.log(formData.trending)}
          </label>
          <br/>
          <label htmlFor="title">Title:</label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            className="border border-1 px-2 form-control my-2"
            onChange={handleChange}
            value={formData.title}
            required
          />
          <br />
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            className="border border-1 px-2 form-control my-2"
            onChange={handleChange}
            value={formData.category}
            required
          />

          <br />
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            className="border border-1 px-2 form-control my-2"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <br />
          <label htmlFor="desc">Description</label>
          <input
            type="text"
            id="desc"
            name="desc"
            className="border border-1 px-2 form-control my-2"
            onChange={handleChange}
            value={formData.desc}
            required
          />
          <br />
          <label htmlFor="content">Content:</label>
          <br />
          <JoditEditor
            ref={editor}
            value={content}
            tabIndex={1}
            onBlur={(newContent) => setContent(newContent)}
            onChange={(newContent) => setContent(newContent)}
          />
          <br />
          <input type="file" name="nfile" onChange={handleChange} />
          <br />
          <input type="submit" value={'Submit Data'} className="btn1 btn btn-success mx-1" />
          <button type="button" className="btn1 btn btn-danger mx-1" onClick={handleReset}>Reset</button>
        </form>
      </div>
    </>
  );
};

export default MyForm;
