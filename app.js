require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: name
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://" + process.env.SERVER_ID + ".api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;

  const options = {
    method: "POST",
    auth: "sasi123:" + process.env.API_KEY
  }

  const request = https.request(url, options, (response) => {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/thankyou.html");
    } else {
      res.sendFile(__dirname + "/wrong.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });

  });

  request.write(jsonData);
  request.end();

  console.log("URL: " + url);
  console.log("API: " + options.auth);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000.");
});
