const router = require("express").Router();
var path = process.cwd();
const DB = require(path + "/lib/db");

router.post("/id", async (req, res) => {
  const id = req.body.id;

  const result = {
    code: "success",
    message: "사용 가능한 아이디입니다.",
  };

  const queryresult = await DB.runDB(
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

router.post("/email", async (req, res) => {
  const email = req.body.email;

  const result = {
    code: "success",
    message: "사용 가능한 이메일입니다.",
  };

  const queryresult = await DB.runDB(
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

router.post("/nickname", async (req, res) => {
  const nickname = req.body.nickname;

  const result = {
    code: "success",
    message: "사용 가능한 닉네임입니다.",
  };

  const queryresult = await DB.runDB(
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

module.exports = router;
