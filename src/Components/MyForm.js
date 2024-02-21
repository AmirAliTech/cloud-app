import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
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
    desc: "",
    email: "",
    nfile: null,
  });

  useEffect(() => {
    const navigatetoken = localStorage.getItem("token");
    if (!navigatetoken) {
      navigate('/login');
    }
  }, [navigate]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setFormData({
        title: "",
        desc: "",
        email: "",
        nfile: null,
      })
      setContent("")
      toast.success('Data Reset Successfully')
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
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
      formDataToSend.append("desc", formData.desc);
      formDataToSend.append("email", formData.email);
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
          desc: "",
          email: "",
          nfile: null,
        });
        setContent("");
        toast.success("Submit Successfully");
        const expirationTime = 60 * 60000;
        setTimeout(() => {
          localStorage.removeItem("token");
        }, expirationTime);
        navigate("/find");
      } else {
        console.error("Failed to save data");
        toast.error( 'Failed to save data');
      }
    } catch (error) {
      console.error("Error:", error.message);
      toast("Something went wrong while Submitting data");

    }
  };

  return (
    <>
      <SideComponent />
      <div className="form">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="name">Title:</label>
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
          <label htmlFor="message">Message:</label>
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
          <input type="submit" value={'Submit Data'} className="btn1 btn  btn-success mx-1" />
          <span className="btn1 btn  btn-danger mx-1 " onClick={handleReset}>reset</span>
        </form>
      </div>
    </>
  );
};

export default MyForm;
