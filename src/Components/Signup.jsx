import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import modeContext from '../Context/Dark_lightMode/modeContext';

export default function Signup(props) {
  const signupUrl = import.meta.env.VITE_SIGNUP_URL;

  console.log("signup url : ", signupUrl);

  const [credential, setcredential] = useState({ name: "", email: "", password: "", cpassword: "" });
  const navigate = useNavigate();

  const context = useContext(modeContext);
  const {mode} = context;

  const handleChange = (e) => {
    setcredential((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Credential : ", credential);
    if (credential.password !== credential.cpassword) {
        props.showAlert("The password and confirmation password do not match.","Error","danger");
    }
    else {
      const response = await fetch(signupUrl, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: credential.name, email: credential.email, password: credential.password })
      });
      const json = await response.json();
      if (json.success) {
        console.log("Signup token is : ", json.token);
        //Save the token into local storage and redirect.
        localStorage.setItem('token', json.token);
        props.showAlert("Successfully account created.", "Success", "success");
        navigate("/");
      }
      //Loggin unsuccessful
      else {
        props.showAlert("Sorry a user with this email already exists!", "Error", "danger");
      }
      // setcredential({ email: "", password: ""})
    }
  }
  return (
    <div className='container'>
      <h2 style={{color:mode === 'dark'?'white':'black'}}>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label" style={{color:mode === 'dark'?'white':'black'}}>Name </label>
          <input type="text" className="form-control" id="name" name="name" aria-describedby="emailHelp" onChange={handleChange} minLength={3} required style={{color:mode==='dark'?'white':'black', backgroundColor:mode==='dark'?'#293340':'white'}}/>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label" style={{color:mode === 'dark'?'white':'black'}}>Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={handleChange} required style={{color:mode==='dark'?'white':'black', backgroundColor:mode==='dark'?'#293340':'white'}}/>
          <div id="emailHelp" className="form-text" style={{color:mode === 'dark'?'white':'black'}}>We'll never share your email with anyone else.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label" style={{color:mode === 'dark'?'white':'black'}}>Password</label>
          <input type="password" className="form-control" id="password" name="password" onChange={handleChange} minLength={5} required style={{color:mode==='dark'?'white':'black', backgroundColor:mode==='dark'?'#293340':'white'}}/>
        </div>

        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label" style={{color:mode === 'dark'?'white':'black'}}>Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={handleChange} required style={{color:mode==='dark'?'white':'black', backgroundColor:mode==='dark'?'#293340':'white'}}/>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
