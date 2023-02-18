const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = 5000;

require("dotenv").config();

var path = process.cwd();
const auth = require(path + "/routes/auth");
const dup = require(path + "/routes/duplicate");
const mymate = require(path + "/routes/mymate");
const mytrip = require(path + "/routes/mytrip");
const usermanage = require(path + "/routes/usermanage");
const datarequest = require(path + "/routes/datarequest");

app.use(express.json());

app.use(
  session({
    secret: process.env.REACT_APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("여기로 옵니다!");
});

app.listen(port, () => {
  console.log("서버가 시작되었습니다");
});

app.use("/auth", auth);
app.use("/dupcheck", dup);
app.use("/mymate", mymate);
app.use("/mytrip", mytrip);
app.use("/updateuser", usermanage);
app.use("/datareq", datarequest);
