import React from 'react';
import Smartcar from '@smartcar/auth';

function App() {

  const smartcar = new Smartcar({
    testMode: true,
    clientId: process.env.REACT_APP_CLIENT_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scope: ['required:read_vehicle_info'], // TODO add permissions forEach to be queried
    onComplete: function(error: string | undefined, code: unknown) {
      if (error) {
        // handle errors from Connect (i.e. user denies access)
        throw new Error(error)
      }
      // handle the returned code by sending it to your back-end server
      console.log({code});
    },
  });

  return (
    <div style={{display: 'grid', placeContent: 'center', height: "100vh"}}>
      <button type="button" onClick={() => smartcar.openDialog({forcePrompt: true})}>CONNECT</button>
    </div>
  );
}

export default App;
