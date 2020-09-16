const express = require("express");
const Joi = require("joi");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const cors = require("cors");

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
// app.use(addAllowOriginHeader); //the same for cors manually
// app.options("*", addCorsHeaders);

app.get("/weather", validateWeatherQueryParams, getWeather);

function validateWeatherQueryParams(req, res, next) {
  const weatherRules = Joi.object({
    lat: Joi.string().required(),
    lon: Joi.string().required(),
  });

  const validationResult = weatherRules.validate(req.query);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

async function getWeather(req, res, next) {
  const { lat, lon } = req.query;
  const response = await fetch(
    //`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPEN_WEATHER_APPID}`

    `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_SECRET_KEY}/${lat},${lon}?exclude=daily,hourly,minutely`
  );
  const responseBody = await response.json();

  if (responseBody.error) {
    return res.status(responseBody.code).send(responseBody.error);
  }
  return res.status(200).send(responseBody);
}

// function addAllowOriginHeader(req, res, next) { //for cors manually
//   res.set("Access-Control-Allow-Origin", "http://localhost:3000");
// next();
//}

// function addCorsHeaders(req, res, next) {
//   res.set(
//     "Access-Control-Allow-Methods",
//     req.headers["access-control-request-method"]
//   );
//   res.set(
//     "Access-Control-Allow-Headers",
//     req.headers["access-control-request-headers"]
//   );
//   res.status(200).send();
// }

app.listen(PORT, () => {
  console.log("Started listening on port", PORT);
});
