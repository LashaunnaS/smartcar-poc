import { useEffect, useState } from 'react';
import Smartcar from '@smartcar/auth';
import axios from 'axios';
import './shared/styles.css';
import { scopeMap } from './shared/scopeMap';
import Connect from './components/Connect';
import Vehicle from './components/Vehicle';
import ErrorFallBack from "./components/ErrorFallBack";

interface ScopeData {
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
  read_vehicle_info?: string;
  read_fuel?: string;
  read_tires?: string;
  [index: number]: ScopeData;
}

const App = (): JSX.Element => {
  const [authCode, setAuthCode] = useState('');
  const [validScope, setValidScope] = useState([]);
  const [validScopeAttributes, setValidScopeAttributes] = useState<ScopeAttributesProps[]>([]);
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
      'read_battery',
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
        localStorage.setItem('access_token', code);

        // handle the returned code by sending it to your back-end server
        const res = await axios.get(`${process.env.REACT_APP_SERVER}/exchange?code=${code}`);
        setValidScope(res.data.permissions);
      }
    }
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setAuthCode(accessToken);
    }
  }, [authCode]);

  useEffect(() => {
    const scopeData = localStorage.getItem('validScopeAttributes');
    if (scopeData && validScopeAttributes.length === 0) {
      setValidScopeAttributes(JSON.parse(scopeData));
    }
  }, [validScopeAttributes]);

  useEffect(() => {
    if (authCode !== '' && validScope.length > 0 && validScopeAttributes.length === 0) {
      const fetchRepoInfos = async () => {
        const promises = validScope.map(async (scope: string) => {
          const response = await axios.get(`${process.env.REACT_APP_SERVER}/${scopeMap[scope].url}`);

          const { meta, id, ...rest } = response.data;

          return [
            scope,
            rest
          ];
        });

        return await Promise.all(promises).then((data) => setValidScopeAttributes(data));
      };

      fetchRepoInfos();
    };

    validScopeAttributes.length > 0 && localStorage.setItem('validScopeAttributes', JSON.stringify(validScopeAttributes));
  }, [authCode, validScope, validScopeAttributes]);

  const authorize = () => smartcar.openDialog({ forcePrompt: true });
  const newVehicleAccess = () => {
    window.localStorage.clear();
    setAuthCode('');
    setValidScope([]);
    setValidScopeAttributes([]);
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
      {!authCode ? handleLogin : validScopeAttributes.map((scopeAttributes, index: number) =>
        <Vehicle scopeAttributes={scopeAttributes} key={`${index}-${scopeAttributes[0]}`} />
      )}
    </main>
  );
};

export default App;
