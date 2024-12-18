const router = require("express").Router();
const md5 = require("md5");
var path = process.cwd();
const DB = require(path + "/lib/db");
const mailer = require(path + "/lib/mailer");

router.get("/authcheck", (req, res) => {
  const sendData = { isLogin: "" };
  if (req.session.is_logined) {
    sendData.isLogin = true;
  } else {
    sendData.isLogin = false;
  }
  res.send(sendData);
});

router.get("/userinfo", async (req, res) => {
  const queryresult = await DB.runDB(`SELECT * FROM user WHERE mem_idx = ${req.session.idx}`);
  res.send(queryresult[0]);
});

router.post("/login", async (req, res) => {
  /**
   * 디비에서 아이디&비번 확인
   */
  const id = req.body.id;
  const pw = req.body.pw;
  const autologin = req.body.autologin;

  const result = {
    code: "success",
    message: "로그인 성공",
    redirect: "",
  };

  //비밀번호 hash 암호화 MD5로
  const hashpw = md5(pw);

  const queryresult = await DB.runDB(
    `SELECT * FROM user WHERE mem_userid = '${id}' and mem_password = '${hashpw}' AND mem_status = 'Y'`
  );

  if (queryresult.length === 0) {
    result.code = "error";
    result.message = "로그인에 실패하였습니다!";
    res.send(result);
    return;
  }

  /**
   * 로그인 세션 저장
   */
  req.session.is_logined = true;
  req.session.idx = queryresult[0].mem_idx;
  req.session.save(() => {
    result.redirect = "/";
    res.send(result);
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.send({ isLogin: false });
});

router.post("/join", async (req, res) => {
  /**
   *
   * DB에 id,nickname,pw insert
   */
  const { id, pw, name, email, nickname, phone } = req.body;

  const hashpw = md5(pw);

  const result = {
    code: "success",
    message: "회원가입이 완료되었습니다!",
  };

  let queryresult = "";
  phone === ""
    ? (queryresult = `INSERT INTO user(mem_userid,mem_password,mem_username,mem_email,mem_nickname,mem_phone,mem_regtime) VALUES ('${id}','${hashpw}','${name}','${email}','${nickname}','',NOW())`)
    : (queryresult = `INSERT INTO user(mem_userid,mem_password,mem_username,mem_email,mem_nickname,mem_phone,mem_regtime) VALUES ('${id}','${hashpw}','${name}','${email}','${nickname}','${phone}',NOW())`);
  await DB.runDB(queryresult);

  res.send(result);
});

router.post("/withdrawalreq", async (req, res) => {
  const idx = req.body.idx;

  const result = {
    code: "success",
    message: "회원 탈퇴가 완료되었습니다.",
  };

  const matequeryresult = await DB.runDB(`DELETE FROM mate WHERE req_idx = ${idx} OR res_idx=${idx}`);
  const userqueryresult = await DB.runDB(`DELETE FROM user WHERE mem_idx = ${idx}`);
  res.send(result);
});

router.post("/findid", async (req, res) => {
  const { type, name, ind } = req.body;

  const result = {
    code: "success",
    message: "회원 조회 성공",
    id: "",
  };

  let queryresult = "";

  if (type === "email") {
    queryresult = await DB.runDB(
      `SELECT mem_userid FROM user WHERE mem_username = '${name}' AND mem_email = '${ind}' AND mem_status = 'Y'`
    );
  } else if (type === "phone") {
    queryresult = await DB.runDB(
      `SELECT mem_userid FROM user WHERE mem_username = '${name}' AND mem_phone = '${ind}' AND mem_status = 'Y'`
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

router.post("/findpw", async (req, res) => {
  const { id } = req.body;

  const result = {
    code: "success",
    message: "아이디 조회 성공",
  };

  const queryresult = await DB.runDB(
    `SELECT mem_userid, mem_email FROM user WHERE mem_userid = '${id}' AND mem_status = 'Y'`
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

// 메일 전송 라우트
router.post("/mail", async (req, res) => {
  const { yourname, youremail } = req.body;

  //인증 코드 생성(6자리)
  let vericode = Math.floor(Math.random() * 1000000) + 100000;
  if (vericode > 1000000) {
    vericode = vericode - 100000;
  }

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

router.post("/pwdchange", async (req, res) => {
  const idx = req.body.idx;
  const id = req.body.id;
  const modpwd = req.body.modpwd;
  const hashmodpw = md5(modpwd);

  const result = {
    code: "success",
    message: "비밀번호 변경 성공",
  };

  if (id) {
    const query = await DB.runDB(`UPDATE user SET mem_password="${hashmodpw}" WHERE mem_userid = '${id}'`);

    res.send(result);
    return;
  }

  const query = await DB.runDB(`UPDATE user SET mem_password="${hashmodpw}" WHERE mem_idx = ${idx}`);

  const queryresult = await DB.runDB(`SELECT * FROM user WHERE mem_idx = ${idx}`);

  /**
   * 로그인 세션 회원정보 다시 저장
   */
  req.session.loginUser = queryresult[0];
  req.session.save();
  res.send(result);
});

module.exports = router;
