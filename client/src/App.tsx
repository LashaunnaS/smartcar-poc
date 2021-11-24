import { useEffect, useState } from 'react';
import Smartcar from '@smartcar/auth';
import axios from 'axios';
import './shared/styles.css';
import Connect from './components/Connect';
import Vehicle from './components/Vehicle';
import ErrorFallBack from "./components/ErrorFallBack";

export interface ScopeData {
  state?: string;
  isPluggedIn?: boolean;
  lifeRemaining?: number;
  percentRemaining?: number;
  range?: number;
  distance?: number;
  id?: string;
  make?: string;
  modal?: string;
  year?: number;
  amountRemaining?: number;
  backRight?: number;
  fronRight?: number;
  backLeft?: number;
  fronLeft?: number;
};

export interface ScopeAttributesProps {
  read_charge?: string;
  read_engine_oil?: string;
  read_battery?: string,
  read_odometer?: string;
  read_vehicle_info: string;
  read_fuel?: string;
  read_tires?: string;
  [index: number]: ScopeData;
}

const App = (): JSX.Element => {
  const [authCode, setAuthCode] = useState('');
  const [validScope, setValidScope] = useState<string[]>([]);
  const [thrownError, setThrownError] = useState({
    hasError: false,
    errorMessage: ''
  });

  const smartcar = new Smartcar({
    testMode: true,
    clientId: process.env.REACT_APP_CLIENT_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scope: [
      'required:read_vehicle_info',
      'required:read_battery',
      'read_odometer',
      'read_charge',
      'read_fuel',
      'read_tires',
      'read_engine_oil'
    ],
    onComplete: async (error: any | undefined, code: string) => {
      if (error) {
        // handle errors from Connect (i.e. user denies access)
        setThrownError({
          hasError: true,
          errorMessage: error.message
        });
      } else {
        setAuthCode(code);
        localStorage.setItem('accessToken', code);

        // handle the returned code by sending it to your back-end server
        const res = await axios.get(`${process.env.REACT_APP_SERVER}/exchange?code=${code}`);
        setValidScope(res.data.permissions);
        localStorage.setItem('validScope', res.data.permissions);
      }
    }
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setAuthCode(accessToken);
    }
  }, []);

  useEffect(() => {
    const scopeKeys = localStorage.getItem('validScope');
    if (scopeKeys) {
      setValidScope(scopeKeys.split(','));
    }
  }, []);

  const authorize = () => smartcar.openDialog({ forcePrompt: true });
  const newVehicleAccess = () => {
    window.localStorage.clear();
    setAuthCode('');
    setValidScope([]);
  };
  const resetErrorBoundry = () => setThrownError({
    hasError: false,
    errorMessage: ''
  });

  const handleLogin = !thrownError.hasError ? <Connect onClick={authorize} /> : <ErrorFallBack onClick={resetErrorBoundry} errorMessage={thrownError.errorMessage} />;

  return (
    <main>
      <nav className='main-nav'>
        <h1>SMARTCAR</h1>
        {authCode && <button onClick={newVehicleAccess}>ACCESS NEW VEHICLE</button>}
      </nav>
      {!authCode ? handleLogin :
        validScope.map((scope: string, index: number) => <Vehicle scope={scope} key={`${index}-${scope}`} />)
      }
    </main>
  );
};

export default App;
