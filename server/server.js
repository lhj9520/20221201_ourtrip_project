const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mysql = require("mysql2");
const md5 = require("md5");

const db = mysql.createPoolCluster();
const app = express();
const port = 5000;

app.use(express.json());

app.use(
  session({
    secret: "SECRET",
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

db.add("project", {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "frontend_project",
  port: 3306,
});

function runDB(query) {
  return new Promise(function (resolve, reject) {
    db.getConnection("project", function (error, connection) {
      if (error) {
        console.log("DB Connection Error!", error);
        reject(true);
      }

      connection.query(query, function (error, data) {
        if (error) {
          console.log("query error", error);
          reject(true);
        }

        resolve(data);
      });
      connection.release();
    });
  });
}

app.get("/", (req, res) => {
  res.send("여기로 옵니다!");
});

app.post("/idcheck", async (req, res) => {
  /**
   * 아이디 중복체크
   */
  // console.log(req.body);
  const id = req.body.id;

  const result = {
    code: "success",
    message: "사용 가능한 아이디입니다.",
  };

  const queryresult = await runDB(
    `SELECT * FROM user WHERE mem_userid = '${id}'`
  );

  if (queryresult.length > 0) {
    result.code = "error";
    result.message = "이미 사용중인 아이디입니다.";
    res.send(result);
    return;
  }

  res.send(result);
});

app.post("/emailcheck", async (req, res) => {
  /**
   * 이메일 중복체크
   */
  // console.log(req.body);
  const email = req.body.email;

  const result = {
    code: "success",
    message: "사용 가능한 이메일입니다.",
  };

  const queryresult = await runDB(
    `SELECT * FROM user WHERE mem_email = '${email}'`
  );

  if (queryresult.length > 0) {
    result.code = "error";
    result.message = "이미 사용중인 이메일입니다.";
    res.send(result);
    return;
  }

  res.send(result);
});

app.post("/nicknamecheck", async (req, res) => {
  /**
   * 닉네임 중복체크
   */
  console.log(req.body);
  const nickname = req.body.nickname;

  const result = {
    code: "success",
    message: "사용 가능한 닉네임입니다.",
  };

  const queryresult = await runDB(
    `SELECT * FROM user WHERE mem_nickname = '${nickname}'`
  );

  if (queryresult.length > 0) {
    result.code = "error";
    result.message = "이미 사용중인 닉네임입니다.";
    res.send(result);
    return;
  }

  res.send(result);
});

app.post("/join", async (req, res) => {
  /**
   *
   * DB에 id,nickname,pw insert
   */
  const { id, pw, name, birth, email, gender, nickname, phone } = req.body;

  const hashpw = md5(pw);
  const month = birth.month.length === 1 ? "0" + birth.month : birth.month;
  const day = birth.day.length === 1 ? "0" + birth.day : birth.day;
  const bdate = `${birth.year}-${month}-${day}`;

  const result = {
    code: "success",
    message: "회원가입이 완료되었습니다!",
  };

  let queryresult = "";
  phone === ""
    ? (queryresult = `INSERT INTO USER(mem_userid,mem_password,mem_username,mem_birth,mem_email,mem_gender,mem_nickname,mem_phone,mem_regtime) VALUES ('${id}','${hashpw}','${name}','${bdate}','${email}','${gender}','${nickname}',NULL,NOW())`)
    : (queryresult = `INSERT INTO USER(mem_userid,mem_password,mem_username,mem_birth,mem_email,mem_gender,mem_nickname,mem_phone,mem_regtime) VALUES ('${id}','${hashpw}','${name}','${bdate}','${email}','${gender}','${nickname}','${phone}',NOW())`);
  await runDB(queryresult);

  res.send(result);
});

app.post("/login", async (req, res) => {
  /**
   * 디비에서 아이디&비번 확인
   */
  console.log(req.body);
  const id = req.body.id;
  const pw = req.body.pw;
  const autologin = req.body.autologin;

  const result = {
    code: "success",
    message: "로그인 성공",
  };

  //비밀번호 hash 암호화 MD5로
  const hashpw = md5(pw);
  // console.log(hashpw);

  const queryresult = await runDB(
    `SELECT * FROM user WHERE mem_userid = '${id}' and mem_password = '${hashpw}'`
  );

  if (queryresult.length === 0) {
    result.code = "error";
    result.message = "로그인에 실패하였습니다!";
    res.send(result);
    return;
  }

  /**
   * 로그인 세션 회원정보 저장
   */
  req.session.loginUser = queryresult[0];
  req.session.save();

  res.send(result);
});

app.get("/user", (req, res) => {
  console.log(req.session.loginUser);
  res.send(req.session.loginUser);
});

app.get("/userdelete", (req, res) => {
  req.session.loginUser = {};
  req.session.save();
  res.send(req.session.loginUser);
});

app.post("/matelist", async (req, res) => {
  console.log(req.body);
  const idx = req.body.idx;
  // const id = req.body.id;

  const result = {
    code: "success",
    message: "메이트 목록 업데이트",
    data: "",
  };

  const queryresult = await runDB(
    `(SELECT mem_idx2,mem_userid,mem_nickname FROM mate,USER WHERE mem_idx1 = ${idx} AND reqstate = 'A' AND matestate = TRUE AND mem_idx2 = mem_idx) UNION (SELECT mem_idx1 AS mem_idx2,mem_userid,mem_nickname FROM mate,USER WHERE mem_idx2 = ${idx} AND reqstate = 'A' AND matestate = TRUE AND mem_idx1 = mem_idx)
    `
  );

  // console.log(queryresult);
  result.data = queryresult;
  res.send(result);
});

app.post("/matereqlist", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  // const id = req.body.id;

  const result = {
    code: "success",
    message: "메이트 요청 목록 업데이트",
    data: "",
  };

  const queryresult = await runDB(
    `SELECT mem_idx,mem_userid, mem_nickname FROM mate, USER WHERE mem_idx2 = ${idx} AND mem_idx1 = mem_idx AND reqstate = 'R' AND matestate = FALSE`
  );

  // console.log(queryresult);
  result.data = queryresult;
  res.send(result);
});

app.post("/mateaccept", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const mateidx = req.body.mateidx;

  const result = {
    code: "success",
    message: "메이트 수락 완료",
  };

  const queryresult = await runDB(
    `UPDATE mate SET reqstate = 'A', matestate = TRUE WHERE ((mem_idx1 = ${mateidx} AND mem_idx2 = ${idx}) OR (mem_idx2 = ${mateidx} AND mem_idx1 = ${idx}))`
  );

  res.send(result);
});

app.post("/matedecline", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const mateidx = req.body.mateidx;

  const result = {
    code: "success",
    message: "메이트 거절 완료",
  };

  const queryresult = await runDB(
    `UPDATE mate SET reqstate = 'D', matestate = FALSE WHERE ((mem_idx1 = ${mateidx} AND mem_idx2 = ${idx}) OR (mem_idx2 = ${mateidx} AND mem_idx1 = ${idx}))`
  );

  res.send(result);
});

app.listen(port, () => {
  console.log("서버가 시작되었습니다");
});
