const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const Pusher = require("pusher");
const crypto = require("crypto");

const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pusher = new Pusher({
  appId: "1384050",
  key: "8fcd545629b68a2e1fa3",
  secret: "94d67e4a26b0c5ae4ea6",
  cluster: "us2",
});

app.use(express.static(path.join(__dirname, "/src/index.html")));

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  next();
});

app.post("/pusher/auth", function (req, res) {
  let socketId = req.body.socket_id;
  let channel = req.body.channel_name;
  let presenceData = {
    user_id: crypto.randomBytes(10).toString("hex"),
  };

  let auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/src/index.html"));
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Arriba en el puerto ${port}`));
