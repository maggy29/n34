const express = require("express");
const Joi = require("joi");
const dotenv = require("dotenv");

const app = express();
const PORT = 3000;

dotenv.config();
// console.log(process.env);

app.use(express.json());

app.get("/hello", (req, res, next) => {
  console.log(req.body);
  res.send("hello world");
});

app.get(
  "/weather",
  (req, res, next) => {
    const weatherRules = Joi.object({
      lat: Joi.string().required(),
      lon: Joi.string().required(),
    });

    const validationResult = weatherRules.validate(req.query);

    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  },
  (req, res, next) => {
    console.log(req.query);
    res.json({ weather: "test" }); //json allow us send response and fix content
    //type in headers
  }
);

app.listen(PORT, () => {
  console.log("Started listening on port", PORT);
});
