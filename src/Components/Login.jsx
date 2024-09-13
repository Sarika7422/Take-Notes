import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import modeContext from '../Context/Dark_lightMode/modeContext';

export default function Login(props) {
    const loginUrl = import.meta.env.VITE_LOGIN_URL;
    console.log("login : ", loginUrl);

    const [credential, setcredential] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    // console.log("mode : ",mode);
    const context = useContext(modeContext);
    const {mode} = context;

    const handleChange = (e) => {
        setcredential((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Credential : ", credential);

        const response = await fetch(loginUrl, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credential.email, password: credential.password })
        });
        const json = await response.json();
        if (json.success) {
            console.log("Login token is : ", json.token);
            //Save the token into local storage and redirect.
            localStorage.setItem('token', json.token);
            props.showAlert("Logged in successfully.", "Success", "success");
            navigate("/");
        }
        //Loggin unsuccessful
        else {
            props.showAlert("Invalid credentials!", "Error", "danger");
        }
        // setcredential({ email: "", password: ""})
    }
    console.log("login : ", loginUrl);

    return (
        <div className='container'>
            <h2 style={{color:mode === 'dark'?'white':'black'}}>Login to view your notes.</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label" style={{color:mode === 'dark'?'white':'black'}}>Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={handleChange} style={{color:mode==='dark'?'white':'black', backgroundColor:mode==='dark'?'#293340':'white'}}/>
                    <div id="emailHelp" className="form-text" style={{color:mode === 'dark'?'white':'black'}}>We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3" >
                    <label htmlFor="password" className="form-label" style={{color:mode === 'dark'?'white':'black'}} >Password</label>
                    <input type="password" className="form-control" id="password" name="password" onChange={handleChange} style={{color:mode === 'dark'?'white':'black', backgroundColor:mode==='dark'?'#293340':'white'}}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
