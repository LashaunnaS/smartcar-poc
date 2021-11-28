import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import smartcar from 'smartcar';

dotenv.config();
const app = express();

// global variable to save our accessToken & refreshToken
let access;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://smartcar-poc-client.vercel.app',
    'http://localhost:8000',
    'https://smartcar-poc-server.vercel.app'
  ]
}));

// Create a new AuthClient object 
const client = new smartcar.AuthClient({
  redirectUri: process.env.SMARTCAR_REDIRECT_URI,
  clientSecret: process.env.SMARTCAR_CLIENT_SECRET,
  clientId: process.env.SMARTCAR_CLIENT_ID,
  testMode: true, // launch Smartcar Connect in test mode
});

// login, and then accept or deny your scope's permissions
app.get('/login', function (req, res) {
  // Redirect the user to Smartcar Connect using getAuthUrl with required scope or with one of our frontend SDKs.
  const authUrl = client.getAuthUrl([
    'required:read_vehicle_info',
    'read_battery',
    'read_odometer',
    'read_charge',
    'read_fuel',
    'read_tires',
    'read_engine_oil'
  ]);

  response.set({
    'Access-Control-Allow-Origin': [
      'https://smartcar-poc-client.vercel.app',
      'https://smartcar-poc-server.vercel.app'
    ]
  });
  res.redirect(authUrl);
});

app.get('/exchange', async function (req, res) {
  const code = req.query.code;
  // in a production app you'll want to store this in some kind of persistent storage
  access = await client.exchangeCode(code);
  res.redirect('/permissions');
});

/*
  Returns a list of the permissions that have been granted to your
  application in relation to this vehicle.
  https://smartcar.com/docs/api?version=v2.0&language=Node#get-application-permissions
*/
app.get('/permissions', async function (req, res) {
  // TODO: Request Step 2: Get vehicle information
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  // instantiate the first vehicle in the vehicle id list
  const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.permissions();

  res.status(200)
    .json(attributes)
    .end();
});

/*
  Returns a single vehicle object, containing identifying information.
  https://smartcar.com/docs/api?version=v2.0&language=Node#get-vehicle-attributes
*/
app.get('/vehicle', async function (req, res) {
  // TODO: Request Step 2: Get vehicle information
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  // instantiate the first vehicle in the vehicle id list
  const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.attributes();

  res.status(200)
    .json(attributes)
    .end();
});

/*
  Returns the vehicle’s last known odometer reading.
  https://smartcar.com/docs/api/#get-odometer
*/
app.get('/odometer', async function (req, res) {
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.odometer();

  res.status(200)
    .json(attributes)
    .end();
});

/*
  Returns the remaining life span of a vehicle’s engine oil.
  https://smartcar.com/docs/api/?version=v2.0&language=Node#get-engine-oil-life
*/
app.get('/engine/oil', async function (req, res) {
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.engineOil();

  res.status(200)
    .json(attributes)
    .end();
});

/*
  Returns the current charge status of an electric vehicle.
  https://smartcar.com/docs/api/#get-ev-charging-status
*/
app.get('/charge', async function (req, res) {
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.charge();

  res.status(200)
    .json(attributes)
    .end();
});

/*
  Returns the total capacity of an electric vehicle's battery. & Returns the current charge status of an electric vehicle
  https://smartcar.com/docs/api/#get-ev-battery-capacity
*/
app.get('/battery', async function (req, res) {
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.battery();

  res.status(200)
    .json(attributes)
    .end();
});

/*
  Returns the status of the fuel remaining in the vehicle’s gas tank
  https://smartcar.com/docs/api/#get-fuel-tank
*/
app.get('/fuel', async function (req, res) {
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.fuel();

  res.status(200)
    .json(attributes)
    .end();
});

/*
  Returns the air pressure of each of the vehicle’s tires.
  https://smartcar.com/docs/api/?version=v2.0&language=Node#get-tire-pressure
*/
app.get('/tires/pressure', async function (req, res) {
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.tirePressure();

  res.status(200)
    .json(attributes)
    .end();
});

/*
  Returns the remaining life span of a vehicle’s engine oil.
  https://smartcar.com/docs/api/?version=v2.0&language=Node#get-engine-oil-life
*/
app.get('/engine/oil', async function (req, res) {
  const { vehicles } = await smartcar.getVehicles(access.accessToken);
  const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);
  const attributes = await vehicle.engineOil();

  res.status(200)
    .json(attributes)
    .end();
});

const PORT = process.env.PORT | 8000;

app.listen(PORT, () => console.log(`Smartcar server listening on Port: http://localhost:${PORT}/`));