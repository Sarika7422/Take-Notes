import { useEffect, useState } from 'react';
import './App.css';
import About from './Components/About';
import Alert from './Components/Alert';
import Home from './Components/Home';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import Signup from './Components/Signup';
import ModeState from './Context/Dark_lightMode/modeState';
import NoteState from './Context/Notes/noteState';

import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";


function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type, color) => {
    setAlert({
      msg: message,
      type: type,
      color: color
    });
    setTimeout(() => {
      setAlert(null);
    }, 2500);
  }

  //This works for log out the user when user close the window.
  useEffect(() => {
    const handleTabClose = event => {
      // event.preventDefault();
      localStorage.removeItem('token');

      return (event.returnValue =
        'Are you sure you want to exit?');
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);


  return (
    <>
    {/* All states will be available to all components between this NoteState. */}
      <ModeState>
      <NoteState> 
        <Router>
        <Navbar showAlert = {showAlert}/>
          <Alert alert={alert}/>
          <div className="container">
          <Routes>
            <Route exact path='/' element={<Home showAlert = {showAlert}/>} ></Route>
          
            <Route exact path='/about' element={<About />} ></Route>

            <Route exact path='/login' element={<Login showAlert = {showAlert}/>} ></Route>

            <Route exact path='/signup' element={<Signup showAlert = {showAlert}/>} ></Route>

            <Route path="*" element={<MatchAllRoute />} />
          </Routes>
          </div>
        </Router>
      </NoteState>
      </ModeState>
    </>
  );
}


export default App;


function MatchAllRoute() {
  return <h2>The requested page does not exist</h2>;
}