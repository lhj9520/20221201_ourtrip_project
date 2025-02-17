const router = require("express").Router();
const axios = require("axios");
const request = require("request");
const converter = require("xml-js");

const md5 = require("md5");
var path = process.cwd();
const DB = require(path + "/lib/db");
const mailer = require(path + "/lib/mailer");

router.get("/authcheck", async (req, res) => {
  const sendData = { isLogin: false, type: "" };

  if (req.session.is_logined) {
    sendData.isLogin = true;
    sendData.type = req.session.type;
  }

  res.send(sendData);
});

router.get("/tokencheck", async (req, res) => {
  const result = {
    code: "",
    message: "",
  };

  if (req.session.is_logined && req.session.type === "social_kakao") {
    try {
      // 카카오 토큰 정보 보기 (6시간)
      const tokeninfo = await axios.get(
        `https://kapi.kakao.com/v1/user/access_token_info`,
        {
          headers: {
            Authorization: `Bearer ${req.session.access_token}`,
          },
        }
      );

      // 10분 남았을 때 토큰 갱신
      if (tokeninfo.data.expires_in <= 600) {
        const KAKAO_OAUTH_TOKEN_API_URL = "https://kauth.kakao.com/oauth/token";
        const KAKAO_GRANT_TYPE = "refresh_token";
        const KAKAO_CLIENT_id = process.env.REACT_APP_KAKAO_RESTAPI_KEY;

        // 카카오 로그인 유저 토큰 요청
        const response = await axios.post(
          `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${KAKAO_GRANT_TYPE}&client_id=${KAKAO_CLIENT_id}&refresh_token=${req.session.refresh_token}`,
          {
            headers: {
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          }
        );

        const access_token = response.data.access_token;

        result.code = "success";
        result.message = "토큰 재발급 성공";

        req.session.access_token = access_token;
        req.session.save();
      }
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  }

  res.send(result);
});

router.get("/userinfo", async (req, res) => {
  const queryresult = await DB.runDB(
    `SELECT * FROM user WHERE mem_idx = ${req.session.idx}`
  );
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
    `SELECT * FROM user WHERE mem_userid = '${id}' and mem_password = '${hashpw}' AND mem_status = 'Y' AND mem_type = 'local'`
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
  req.session.type = queryresult[0].mem_type;
  req.session.save(() => {
    result.redirect = "/";
    res.send(result);
  });
});

router.get("/kakaologin", async (req, res) => {
  const code = req.query.code;
  const KAKAO_OAUTH_TOKEN_API_URL = "https://kauth.kakao.com/oauth/token";
  const KAKAO_GRANT_TYPE = "authorization_code";
  const KAKAO_CLIENT_id = process.env.REACT_APP_KAKAO_RESTAPI_KEY;
  const KAKAO_REDIRECT_URL = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  try {
    // 카카오 로그인 유저 토큰 요청
    const response = await axios.post(
      `${KAKAO_OAUTH_TOKEN_API_URL}?grant_type=${KAKAO_GRANT_TYPE}&client_id=${KAKAO_CLIENT_id}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}`,
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }
    );

    const access_token = response.data.access_token;
    const refresh_token = response.data.refresh_token;

    // 카카오 사용자 정보 요청
    const userinfo = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const user_email = userinfo.data.kakao_account.email;
    const user_nickname = String(userinfo.data.properties.nickname).slice(0, 5);
    //랜덤 코드 생성(7자리)
    let randomcode = String(Math.floor(Math.random() * 10000000)).padStart(
      7,
      "0"
    );

    // 유저 DB 조회
    let selectresult = await DB.runDB(
      `SELECT * FROM user WHERE mem_email = '${user_email}' AND mem_status = 'Y' AND mem_type = 'social_kakao'`
    );

    if (selectresult.length === 0) {
      // 유저 DB 추가
      const insertresult = await DB.runDB(
        `INSERT INTO user(mem_userid,mem_password,mem_username,mem_email,mem_nickname,mem_phone,mem_regtime,mem_type) VALUES ('kakao${randomcode}','','카카오','${user_email}','${user_nickname}','',NOW(),'social_kakao')`
      );
      // 유저 다시 조회
      selectresult = await DB.runDB(
        `SELECT * FROM user WHERE mem_email = '${user_email}' AND mem_status = 'Y' AND mem_type = 'social_kakao'`
      );
    }

    /**
     * 로그인 세션 저장
     */
    req.session.is_logined = true;
    req.session.idx = selectresult[0].mem_idx;
    req.session.type = selectresult[0].mem_type;
    req.session.access_token = access_token;
    req.session.refresh_token = refresh_token;
    req.session.save();

    // 메인 페이지로 이동
    res.redirect("http://localhost:3000/");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.get("/logout", async (req, res) => {
  if (req.session.type === "social_kakao") {
    axios({
      method: "POST",
      url: "https://kapi.kakao.com/v1/user/logout",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${req.session.access_token}`,
      },
    })
      .then(() => {})
      .catch((e) => {
        // 이미 만료된 토큰일 경우
        if (e.response.data.code === -401) {
          console.log(e);
        }
      });
  }

  req.session.destroy();
  res.send({ isLogin: false, type: "" });
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
    ? (queryresult = `INSERT INTO user(mem_userid,mem_password,mem_username,mem_email,mem_nickname,mem_phone,mem_regtime,mem_type) VALUES ('${id}','${hashpw}','${name}','${email}','${nickname}','',NOW(),'local')`)
    : (queryresult = `INSERT INTO user(mem_userid,mem_password,mem_username,mem_email,mem_nickname,mem_phone,mem_regtime,mem_type) VALUES ('${id}','${hashpw}','${name}','${email}','${nickname}','${phone}',NOW(),'local')`);
  await DB.runDB(queryresult);

  res.send(result);
});

router.post("/withdrawalreq", async (req, res) => {
  const idx = req.body.idx;

  const result = {
    code: "success",
    message: "회원 탈퇴가 완료되었습니다.",
  };

  const matequeryresult = await DB.runDB(
    `DELETE FROM mate WHERE req_idx = ${idx} OR res_idx=${idx}`
  );

  const userqueryresult = await DB.runDB(
    `DELETE FROM user WHERE mem_idx = ${idx}`
  );

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
      `SELECT mem_userid FROM user WHERE mem_username = '${name}' AND mem_email = '${ind}' AND mem_status = 'Y' AND mem_type = 'local'`
    );
  } else if (type === "phone") {
    queryresult = await DB.runDB(
      `SELECT mem_userid FROM user WHERE mem_username = '${name}' AND mem_phone = '${ind}' AND mem_status = 'Y' AND mem_type = 'local'`
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
    `SELECT mem_userid, mem_email FROM user WHERE mem_userid = '${id}' AND mem_status = 'Y' AND mem_type = 'local'`
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
    const query = await DB.runDB(
      `UPDATE user SET mem_password="${hashmodpw}" WHERE mem_userid = '${id}' AND mem_type = 'local'`
    );

    res.send(result);
    return;
  }

  const query = await DB.runDB(
    `UPDATE user SET mem_password="${hashmodpw}" WHERE mem_idx = ${idx} AND mem_type = 'local'`
  );

  res.send(result);
});

module.exports = router;
