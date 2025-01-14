const router = require("express").Router();
var path = process.cwd();
const DB = require(path + "/lib/db");
const md5 = require("md5");

router.post("/email", async (req, res) => {
  const idx = req.body.idx;
  const email = req.body.email;

  const result = {
    code: "success",
    message: "이메일 변경 성공",
  };

  const query = await DB.runDB(
    `UPDATE user SET mem_email="${email}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await DB.runDB(
    `SELECT * FROM user WHERE mem_idx = ${idx}`
  );

  res.send(result);
});

router.post("/nickname", async (req, res) => {
  const idx = req.body.idx;
  const nickname = req.body.nickname;
  // console.log("닉네임 변경", idx, nickname);

  const result = {
    code: "success",
    message: "닉네임 변경 성공",
  };

  const query = await DB.runDB(
    `UPDATE user SET mem_nickname="${nickname}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await DB.runDB(
    `SELECT * FROM user WHERE mem_idx = ${idx}`
  );

  res.send(result);

  /**
   * 나의 여행에 저장되는 닉네임 변경
   */
  const Lookupquery = await DB.runDB(
    `SELECT seq,mate_idx FROM trip WHERE JSON_EXTRACT( mate_idx, '$."${idx}"' ) IS NOT NULL`
  );

  Lookupquery.map(async (data, index) => {
    let mate = JSON.parse(data.mate_idx);
    mate[queryresult[0].mem_idx] = queryresult[0].mem_nickname;
    const updatequery = await DB.runDB(
      `UPDATE trip SET mate_idx = '${JSON.stringify(mate)}' WHERE seq = ${
        data.seq
      }`
    );
  });
});

router.post("/name", async (req, res) => {
  const idx = req.body.idx;
  const username = req.body.username;

  const result = {
    code: "success",
    message: "이름 변경 성공",
  };

  const query = await DB.runDB(
    `UPDATE user SET mem_username="${username}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await DB.runDB(
    `SELECT * FROM user WHERE mem_idx = ${idx}`
  );

  res.send(result);
});

router.post("/phone", async (req, res) => {
  const idx = req.body.idx;
  const phone = req.body.phone;

  const result = {
    code: "success",
    message: "번호 변경 성공",
  };

  const query = await DB.runDB(
    `UPDATE user SET mem_phone="${phone}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await DB.runDB(
    `SELECT * FROM user WHERE mem_idx = ${idx}`
  );

  res.send(result);
});

router.post("/email", async (req, res) => {
  const idx = req.body.idx;
  const email = req.body.email;

  const result = {
    code: "success",
    message: "이메일 변경 성공",
  };

  const query = await DB.runDB(
    `UPDATE user SET mem_email="${email}" WHERE mem_idx = ${idx}`
  );

  const queryresult = await DB.runDB(
    `SELECT * FROM user WHERE mem_idx = ${idx}`
  );

  res.send(result);
});

router.post("/pwdcheck", async (req, res) => {
  const idx = req.body.idx;
  const curpwd = req.body.curpwd;
  const hashcurpw = md5(curpwd);

  const result = {
    code: "success",
    message: "비밀번호가 일치합니다.",
  };

  const queryresult = await DB.runDB(
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

module.exports = router;
