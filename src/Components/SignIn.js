import React from 'react'
import {auth,provider} from'../Config.js'
import {signInWithPopup} from'firebase/auth'
import { useState } from 'react'
import { useEffect } from 'react'
import { Home } from './Home.js'
import './SignIn.css';
import { useNavigate } from 'react-router-dom'

const SignIn = () => {
    const navigate = useNavigate();
    const [Value,setValue] = useState('')
    const HandleSignIn = () =>{
        signInWithPopup(auth,provider).then((data) => {
            setValue(data.user.email)
            var email = data.user.email
            var name  = data.user.displayName
            var photoUrl = data.user.photoURL
            console.log(data);
            localStorage.setItem('user',JSON.stringify({email,name,photoUrl}) )
            navigate(`/Home`);
        })
    }
    useEffect(() =>{
        console.log("useEffect vala data :",Value)
        setValue(localStorage.getItem('email'));
    })
  return (
    <>
            <div className='cardForSignIn'>
                <center><h1 className='tech'>Tech</h1></center><center><h1 className='x'>X</h1></center>
                
            <div className='bigCon'>
                
                <button onClick={HandleSignIn} className='loginBtn'><i class="fa-brands fa-google" id='icon'></i><b>Login With Google</b></button>
            </div>
            </div>
            
    </>
  )
}
export default SignIn;