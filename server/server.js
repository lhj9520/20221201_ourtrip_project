const express = require("express");
const cors = require("cors");
const session = require("express-session");
const mysql = require("mysql2");
const md5 = require("md5");

const db = mysql.createPoolCluster();
const app = express();
const port = 5000;

// const port = process.env.PORT || 5000;
// dotenv 불러오기
require("dotenv").config();
// 모듈 불러오기
const mailer = require("./mailer.js");

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

app.post("/emailchange", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const email = req.body.email;

  const result = {
    code: "success",
    message: "이메일 변경 성공",
  };

  const query = await runDB(
    `UPDATE USER SET mem_email="${email}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await runDB(`SELECT * FROM user WHERE mem_idx = ${idx}`);

  /**
   * 로그인 세션 회원정보 다시 저장
   */
  const tmp = JSON.stringify(queryresult[0].mem_birth);
  const birth = tmp.slice(1, 9) + (parseInt(tmp.slice(9, 11)) + 1);
  queryresult[0].mem_birth = birth;

  req.session.loginUser = queryresult[0];
  req.session.save();
  // res.send(req.session.loginUser);
  res.send(result);
});

app.post("/nicknamecheck", async (req, res) => {
  /**
   * 닉네임 중복체크
   */
  // console.log(req.body);
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

app.post("/nicknamechange", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const nickname = req.body.nickname;

  const result = {
    code: "success",
    message: "닉네임 변경 성공",
  };

  const query = await runDB(
    `UPDATE USER SET mem_nickname="${nickname}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await runDB(`SELECT * FROM user WHERE mem_idx = ${idx}`);

  /**
   * 로그인 세션 회원정보 다시 저장
   */
  const tmp = JSON.stringify(queryresult[0].mem_birth);
  const birth = tmp.slice(1, 9) + (parseInt(tmp.slice(9, 11)) + 1);
  queryresult[0].mem_birth = birth;

  req.session.loginUser = queryresult[0];
  req.session.save();
  // res.send(req.session.loginUser);
  res.send(result);

  const Lookupquery = await runDB(
    `SELECT seq,mate_idx FROM trip WHERE JSON_EXTRACT( mate_idx, '$.${idx}' ) IS NOT NULL`
  );

  console.log(Lookupquery);

  Lookupquery.map((data, index) => {
    let mate = JSON.parse(data.mate_idx);
    mate[queryresult[0].mem_idx] = queryresult[0].mem_nickname;
    // console.log(JSON.stringify(mate));
    const updatequery = runDB(
      `UPDATE trip SET mate_idx = '${JSON.stringify(mate)}' WHERE seq = ${
        data.seq
      }`
    );
  });
});

app.post("/usernamechange", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const username = req.body.username;

  const result = {
    code: "success",
    message: "이름 변경 성공",
  };

  const query = await runDB(
    `UPDATE USER SET mem_username="${username}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await runDB(`SELECT * FROM user WHERE mem_idx = ${idx}`);

  /**
   * 로그인 세션 회원정보 다시 저장
   */
  const tmp = JSON.stringify(queryresult[0].mem_birth);
  const birth = tmp.slice(1, 9) + (parseInt(tmp.slice(9, 11)) + 1);
  queryresult[0].mem_birth = birth;

  req.session.loginUser = queryresult[0];
  req.session.save();
  // res.send(req.session.loginUser);
  res.send(result);
});

app.post("/phonechange", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const phone = req.body.phone;

  const result = {
    code: "success",
    message: "번호 변경 성공",
  };

  // const query = await runDB(
  //   `UPDATE USER SET mem_phone="${phone}" WHERE mem_idx = ${idx}`
  // );

  const query = await runDB(
    `UPDATE USER SET mem_phone="${phone}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await runDB(`SELECT * FROM user WHERE mem_idx = ${idx}`);

  /**
   * 로그인 세션 회원정보 다시 저장
   */
  const tmp = JSON.stringify(queryresult[0].mem_birth);
  const birth = tmp.slice(1, 9) + (parseInt(tmp.slice(9, 11)) + 1);
  queryresult[0].mem_birth = birth;

  req.session.loginUser = queryresult[0];
  req.session.save();
  // res.send(req.session.loginUser);
  res.send(result);
});

app.post("/emailchange", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const email = req.body.email;

  const result = {
    code: "success",
    message: "이메일 변경 성공",
  };

  const query = await runDB(
    `UPDATE USER SET mem_email="${email}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await runDB(`SELECT * FROM user WHERE mem_idx = ${idx}`);

  /**
   * 로그인 세션 회원정보 다시 저장
   */
  const tmp = JSON.stringify(queryresult[0].mem_birth);
  const birth = tmp.slice(1, 9) + (parseInt(tmp.slice(9, 11)) + 1);
  queryresult[0].mem_birth = birth;

  req.session.loginUser = queryresult[0];
  req.session.save();
  // res.send(req.session.loginUser);
  res.send(result);
});

app.post("/pwdcheck", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const curpwd = req.body.curpwd;
  const hashcurpw = md5(curpwd);

  const result = {
    code: "success",
    message: "비밀번호가 일치합니다.",
  };

  const queryresult = await runDB(
    `SELECT * FROM user WHERE mem_idx=${idx} AND mem_password = '${hashcurpw}'`
  );

  if (queryresult.length === 0) {
    result.code = "error";
    result.message = "비밀번호가 일치하지 않습니다.";
    res.send(result);
    return;
  }
  res.send(result);
});

app.post("/pwdchange", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const id = req.body.id;
  const modpwd = req.body.modpwd;
  const hashmodpw = md5(modpwd);

  const result = {
    code: "success",
    message: "비밀번호 변경 성공",
  };

  // console.log(idx, id, modpwd);
  if (id) {
    // console.log("id 왔을때");
    const query = await runDB(
      `UPDATE USER SET mem_password="${hashmodpw}" WHERE mem_userid = '${id}'`
    );

    res.send(result);
    return;
  }

  const query = await runDB(
    `UPDATE USER SET mem_password="${hashmodpw}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await runDB(`SELECT * FROM user WHERE mem_idx = ${idx}`);

  /**
   * 로그인 세션 회원정보 다시 저장
   */
  const tmp = JSON.stringify(queryresult[0].mem_birth);
  const birth = tmp.slice(1, 9) + (parseInt(tmp.slice(9, 11)) + 1);
  queryresult[0].mem_birth = birth;

  req.session.loginUser = queryresult[0];
  req.session.save();
  // res.send(req.session.loginUser);
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

app.post("/withdrawalreq", async (req, res) => {
  const idx = req.body.idx;

  const result = {
    code: "success",
    message: "탈퇴 성공",
  };

  const queryresult = await runDB(
    `UPDATE USER SET mem_status = 'N', mem_droptime = NOW() WHERE mem_idx = ${idx}`
  );

  res.send(result);
});

app.post("/login", async (req, res) => {
  /**
   * 디비에서 아이디&비번 확인
   */
  // console.log(req.body);
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
    `SELECT * FROM user WHERE mem_userid = '${id}' and mem_password = '${hashpw}' AND mem_status = 'Y'`
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
  const tmp = JSON.stringify(queryresult[0].mem_birth);
  const birth = tmp.slice(1, 9) + (parseInt(tmp.slice(9, 11)) + 1);
  queryresult[0].mem_birth = birth;

  req.session.loginUser = queryresult[0];
  req.session.save();

  res.send(result);
});

app.post("/findid", async (req, res) => {
  // console.log(req.body);
  const { type, name, ind } = req.body;

  const result = {
    code: "success",
    message: "회원 조회 성공",
    id: "",
  };

  let queryresult = "";

  if (type === "email") {
    queryresult = await runDB(
      `SELECT mem_userid FROM USER WHERE mem_username = '${name}' AND mem_email = '${ind}' AND mem_status = 'Y'`
    );
  } else if (type === "phone") {
    queryresult = await runDB(
      `SELECT mem_userid FROM USER WHERE mem_username = '${name}' AND mem_phone = '${ind}' AND mem_status = 'Y'`
    );
  }

  if (queryresult.length === 0) {
    result.code = "error";
    result.message = "해당 회원이 존재하지 않습니다.";
    res.send(result);
    return;
  }

  result.id = queryresult[0].mem_userid;

  res.send(result);
});

app.post("/findpw", async (req, res) => {
  // console.log(req.body);
  const { id } = req.body;

  const result = {
    code: "success",
    message: "아이디 조회 성공",
  };

  const queryresult = await runDB(
    `SELECT mem_userid, mem_email FROM USER WHERE mem_userid = '${id}' AND mem_status = 'Y'`
  );

  if (queryresult.length === 0) {
    result.code = "error";
    result.message = "해당 회원이 존재하지 않습니다.";
    res.send(result);
    return;
  }

  result.id = queryresult[0].mem_userid;
  result.email = queryresult[0].mem_email;

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
  // console.log(req.body);
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

app.post("/matereqlistcnt", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  // const id = req.body.id;

  const result = {
    code: "success",
    message: "메이트 요청 개수 업데이트",
    data: "",
  };

  const queryresult = await runDB(
    `SELECT COUNT(mem_idx) AS cnt FROM mate, USER WHERE mem_idx2 = ${idx} AND mem_idx1 = mem_idx AND reqstate = 'R' AND matestate = FALSE`
  );

  // console.log(queryresult);
  result.data = queryresult[0];
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

app.post("/findidreq", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  const mateid = req.body.mateid;

  const result = {
    code: "success",
    message: "메이트 조회 완료",
    data: "",
  };

  const query1 = await runDB(
    `SELECT * FROM USER WHERE mem_userid = '${mateid}'`
  );

  //아이디 없음
  if (query1.length === 0) {
    result.code = "error";
    result.message = "해당 메이트가 존재하지 않습니다.";
    res.send(result);
    return;
  }
  // console.log(query1);
  const mateidx = query1[0].mem_idx;

  // 로그인한 유저의 아이디를 입력한 경우
  if (idx === mateidx) {
    result.code = "error";
    result.message = "나 자신은 영원한 인생의 친구입니다.";
    res.send(result);
    return;
  }

  const clonedata = {
    idx: query1[0].mem_idx,
    id: query1[0].mem_userid,
    nickname: query1[0].mem_nickname,
  };
  result.data = { ...clonedata };
  // console.log(result.data);

  // mate 테이블에 idx 데이터 있는지 확인
  const query2 = await runDB(
    `SELECT * FROM mate WHERE (mem_idx1 = ${idx} AND mem_idx2 = ${mateidx}) OR (mem_idx2 = ${idx} AND mem_idx1 = ${mateidx})`
  );

  // console.log(query2);

  for (let v of query2) {
    // console.log(v);

    //이미 내가 요청한 상태
    if (v.mem_idx1 === idx && v.reqstate === "R" && v.matestate === 0) {
      result.message = "requested";
      res.send(result);
      return;
    }

    //이미 친구인 상태
    if (
      (v.mem_idx1 === idx || v.mem_idx2 === idx) &&
      v.reqstate === "A" &&
      v.matestate === 1
    ) {
      result.message = "mate";
      res.send(result);
      return;
    }

    //삭제된 상태
    if (
      (v.mem_idx1 === idx || v.mem_idx2 === idx) &&
      v.reqstate === "D" &&
      v.matestate === 0
    ) {
      // console.log("삭제된상태");
      result.message = "true";
      res.send(result);
      return;
    }
  }

  result.message = "true";
  res.send(result);
});

app.post("/matereq", async (req, res) => {
  // console.log(req.body);

  const idx = req.body.idx;
  const mateidx = req.body.mateidx;

  const result = {
    code: "success",
    message: "requested",
  };

  const query = await runDB(
    `SELECT * FROM mate WHERE (mem_idx1 = ${idx} AND mem_idx2 = ${mateidx}) OR (mem_idx2 = ${idx} AND mem_idx1 = ${mateidx})`
  );

  for (let v of query) {
    //삭제된 상태
    if (
      (v.mem_idx1 === idx || v.mem_idx2 === idx) &&
      v.reqstate === "D" &&
      v.matestate === 0
    ) {
      const query = await runDB(
        `UPDATE mate SET reqstate = 'R', matestate = FALSE WHERE ((mem_idx1 = ${mateidx} AND mem_idx2 = ${idx}) OR (mem_idx2 = ${mateidx} AND mem_idx1 = ${idx}))`
      );
      res.send(result);
      return;
    }
  }

  const queryresult = await runDB(
    `INSERT INTO mate(mem_idx1,mem_idx2,reqstate,matestate) VALUES(${idx},${mateidx},'R',FALSE)`
  );

  res.send(result);
});

app.post("/matedelete", async (req, res) => {
  // console.log(req.body);

  const idx = req.body.idx;
  const mateidx = req.body.mateidx;

  // console.log(idx, mateidx);
  const result = {
    code: "success",
    message: "메이트 삭제 완료",
  };

  const queryresult = await runDB(
    `UPDATE mate SET reqstate = 'D', matestate = FALSE WHERE ((mem_idx1 = ${mateidx} AND mem_idx2 = ${idx}) OR (mem_idx2 = ${mateidx} AND mem_idx1 = ${idx}))`
  );

  res.send(result);
});

app.post("/triplist", async (req, res) => {
  // console.log(req.body);
  const idx = req.body.idx;
  // const id = req.body.id;

  const result = {
    code: "success",
    message: "여행 목록 업데이트",
    data: "",
  };

  const queryresult = await runDB(
    `SELECT trip.*,mem_nickname AS host_nickname FROM trip,USER WHERE JSON_EXTRACT( mate_idx, '$.${idx}' ) IS NOT NULL AND mem_idx = host_idx`
  );

  // console.log(queryresult);
  result.data = queryresult;
  res.send(result);
});

app.post("/tripadd", async (req, res) => {
  // console.log(req.body);
  const title = req.body.title;
  const idx = req.body.host_idx;
  const mate = JSON.stringify(req.body.mate_idx);

  const result = {
    code: "success",
    message: "여행 추가",
  };

  const queryresult = await runDB(
    `INSERT INTO trip(title,reg_time,update_time,host_idx,mate_idx) VALUES ('${title}',NOW(),NULL,${idx},'${mate}');
    `
  );

  res.send(result);
});

app.post("/tripdelete", async (req, res) => {
  // console.log(req.body);

  const seq = req.body.seq;

  console.log("삭제할게시글", seq);

  const result = {
    code: "success",
    message: "여행 삭제 완료",
  };

  const queryresult = await runDB(`DELETE FROM trip WHERE seq = ${seq}`);

  res.send(result);
});

app.post("/tripexcept", async (req, res) => {
  // console.log(req.body);

  const seq = req.body.seq;
  const idx = req.body.idx;

  const result = {
    code: "success",
    message: "여행 나가기 완료",
  };

  //SELECT mate_idx FROM trip WHERE seq = 6;
  const mate_idx = await runDB(`SELECT mate_idx FROM trip WHERE seq = ${seq}`);
  const tmp = { ...JSON.parse(mate_idx[0].mate_idx) };
  delete tmp[idx];
  // console.log(JSON.stringify(tmp));

  const queryresult = await runDB(
    `UPDATE trip SET mate_idx = '${JSON.stringify(tmp)}' WHERE seq = ${seq}`
  );

  res.send(result);
});

// 메일 전송 라우트
app.post("/mail", async (req, res) => {
  // console.log(req.body);
  const { yourname, youremail } = req.body;

  //인증 코드 생성(6자리)
  let vericode = Math.floor(Math.random() * 1000000) + 100000;
  if (vericode > 1000000) {
    vericode = vericode - 100000;
  }

  console.log(vericode);

  mailer(youremail, vericode).then((response) => {
    if (response === "success") {
      res.status(200).json({
        status: "Success",
        code: 200,
        message: "Message Sent Successfully!",
        username: yourname,
        useremail: youremail,
        vericode: vericode,
      });
    } else {
      res.json({
        status: "Fail",
        code: response.code,
      });
    }
  });
});

app.listen(port, () => {
  console.log("서버가 시작되었습니다");
});
