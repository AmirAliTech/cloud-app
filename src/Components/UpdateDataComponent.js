import JoditEditor from "jodit-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateDataComponent = () => {
  const editor = useRef(null);
  const { uid } = useParams();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:3001/findOne/${uid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();

          setTitle(data.title);
          setDesc(data.desc);
          setEmail(data.email);
          setContent(data.content);
          setFile(data.nfile);
        } else {
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [uid]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      formData.append("email", email);
      formData.append("content", content);
      if (file) {
        formData.append("nfile", file);
      }

      const response = await fetch(`http://localhost:3001/updatedata/${uid}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setUpdateStatus("Data updated successfully");
        const expirationTime = 60 * 10000;
        setTimeout(() => {
          localStorage.removeItem("token");
        }, expirationTime);
        navigate("/find");
      } else if (response.status === 404) {
        setUpdateStatus("No data found");
      } else {
        setUpdateStatus("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error.message);
      setUpdateStatus("Internal Server Error");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "name":
        setTitle(value);
        break;
      case "desc":
        setDesc(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "message":
        setContent(value);
        break;
      default:
        break;
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <>
      {localStorage.getItem("token") ? (
        <div className="form1">
          <br />
          <label>
            Name:
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Description:
            <input
              type="text"
              name="desc"
              value={desc}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Content:
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
              onChange={(newContent) => setContent(newContent)}
            />
          </label>
          <br />
          <div className="d-flex justify-content-center align-items-center">
            <input
              type="file"
              name="nfile"
              onChange={handleFileChange}
              className="updatefile"
            />
            <img src={`http://localhost:3001/${file}`}
              alt="img"
              className="cimage" />
          </div>
          <br />
          <button onClick={handleUpdate} className="btn btn-primary ">
            Update Data
          </button>
          {updateStatus && <p>{updateStatus}</p>}
        </div>
      ) : (
        <p>401 forbidden</p>
      )}
    </>
  );
};

export default UpdateDataComponent;
