import React, { useState } from 'react';
import modeContext from './modeContext';

export default function ModeState(props) {
    const [mode, setMode] = useState('light');
    const [modeText, setModeText] = useState('Enable Dark Mode');

    const toggleMode = (showAlert) => {
        if (mode === 'light') {
          setMode('dark');
          document.body.style.backgroundColor = '#132945';
          setModeText('Disable Dark Mode');
          showAlert("Dark mode has been enabled", 'Success','success')
        }
        else {
          setMode('light');
          setModeText('Enable Dark Mode');
          document.body.style.backgroundColor = 'white';
          showAlert('Light mode has been enabled', 'Success','success')
        }
      }
  return (
    <modeContext.Provider value={{mode,modeText,toggleMode}}>
        {props.children}
    </modeContext.Provider>
  )
}
