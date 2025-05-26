const express = require("express");
const nocache = require("nocache");
const path = require("path");
const app = express();

const root = require("path").join(__dirname, "", "build");
app.use(nocache());
app.use("/", express.static(path.join(__dirname, "/build")));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});

app.listen(3003);
