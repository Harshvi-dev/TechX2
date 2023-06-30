import React from "react";
import { auth, provider } from "../Config.js";
import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { useEffect } from "react";
import { Home } from "./Home.js";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
//   console.log("auth:", auth);
  const [Value, setValue] = useState("");
  const HandleSignIn = () => {
    signInWithPopup(auth, provider).then((data) => {
      setValue(data.user.email);
      var email = data.user.email;
      var name = data.user.displayName;
      var photoUrl = data.user.photoURL;
      console.log(data);
      localStorage.setItem("user", JSON.stringify({ email, name, photoUrl }));
      navigate(`/Home`);
    });
  };
  useEffect(() => {
    console.log("useEffect vala data :", Value);
    setValue(localStorage.getItem("email"));
  });
  return (
    <>
      <div className="row justify-content-center">
        <div className="card" id="cardOfLogIn">
          <div className="col-12" id="techX" style={{ textAlign: "center" }}>
            <h1 className="tech">
              Tech<b className="x">X</b>
            </h1>
          </div>
          <div className="row">
            <div className="col-12" style={{textAlign:"center"}}>
            <button onClick={HandleSignIn} className='loginBtn'><i class="fa-brands fa-google" id='icon'></i><b>Login With Google</b></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignIn;
