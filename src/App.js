import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../src/App.css";
import MyComponent from "./Components/MyComponent";
import MyForm from "./Components/MyForm";
import UpdateDataComponent from "./Components/UpdateDataComponent";
import SignInComponent from "./Components/SignInComponent";
import PageNot from "./Components/PageNot";
import BlogPage from "./Components/BlogPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
  <div className="app">
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route exact path="/" element={<MyForm />} />
        <Route exact path="/find" element={<MyComponent />} />
        <Route exact path="/update/:uid" element={<UpdateDataComponent />} />
        <Route exact path="/login" element={<SignInComponent />} />
        <Route exact path="/blogpage" element={<BlogPage />} />
        <Route exact path="*" element={<PageNot />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
