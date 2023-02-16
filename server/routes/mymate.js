const router = require("express").Router();
var path = process.cwd();
const DB = require(path + "/lib/db");

router.post("/list", async (req, res) => {
  const idx = req.body.idx;

  const result = {
    code: "success",
    message: "메이트 목록 업데이트",
    mate: [],
  };

  const matequery = await DB.runDB(
    `(SELECT res_idx AS mem_idx,mem_userid,mem_nickname FROM mate,USER WHERE req_idx = ${idx} AND matestate = TRUE AND res_idx = mem_idx) UNION (SELECT req_idx AS idx,mem_userid,mem_nickname FROM mate,USER WHERE res_idx = ${idx} AND matestate = TRUE AND req_idx = mem_idx);
    `
  );
  result.mate = matequery;
  res.send(result);
});

router.post("/reqlist", async (req, res) => {
  const idx = req.body.idx;

  const result = {
    code: "success",
    message: "메이트 목록 업데이트",
    mate: [],
    req: [],
  };

  const matequery = await DB.runDB(
    `(SELECT res_idx AS idx,mem_userid,mem_nickname FROM mate,USER WHERE req_idx = ${idx} AND matestate = TRUE AND res_idx = mem_idx) UNION (SELECT req_idx AS idx,mem_userid,mem_nickname FROM mate,USER WHERE res_idx = ${idx} AND matestate = TRUE AND req_idx = mem_idx);
    `
  );
  result.mate = matequery;
  const reqquery = await DB.runDB(
    `SELECT mem_idx,mem_userid,mem_nickname FROM mate,USER WHERE reqstate = 'R' AND res_idx=${idx} AND req_idx=mem_idx`
  );
  result.req = reqquery;

  res.send(result);
});

router.post("/accept", async (req, res) => {
  const idx = req.body.idx;
  const mateidx = req.body.mateidx;

  const result = {
    code: "success",
    message: "메이트 수락 완료",
  };

  const queryresult = await DB.runDB(
    `UPDATE mate SET reqstate='A', matestate=TRUE WHERE req_idx=${mateidx} AND res_idx=${idx}`
  );

  res.send(result);
});

router.post("/decline", async (req, res) => {
  const idx = req.body.idx;
  const mateidx = req.body.mateidx;

  const result = {
    code: "success",
    message: "메이트 거절 완료",
  };

  const queryresult = await DB.runDB(
    `UPDATE mate SET reqstate='D' WHERE req_idx=${mateidx} AND res_idx=${idx}`
  );

  res.send(result);
});

router.post("/idfind", async (req, res) => {
  const idx = req.body.idx;
  const mateid = req.body.mateid;

  const result = {
    code: "success",
    message: "메이트 조회 완료",
    data: "",
  };

  const matecheck = await DB.runDB(
    `SELECT * FROM USER WHERE mem_userid = '${mateid}'`
  );

  //아이디 없음
  if (matecheck.length === 0) {
    result.code = "error";
    result.message = "해당 메이트가 존재하지 않습니다.";
    res.send(result);
    return;
  }
  const mateidx = matecheck[0].mem_idx;

  // 로그인한 유저의 아이디를 입력한 경우
  if (idx === mateidx) {
    result.code = "error";
    result.message = "나 자신은 영원한 인생의 친구입니다.";
    res.send(result);
    return;
  }

  const clonedata = {
    idx: matecheck[0].mem_idx,
    id: matecheck[0].mem_userid,
    nickname: matecheck[0].mem_nickname,
  };
  result.data = { ...clonedata };

  //이미 친구인지
  const query1 = await DB.runDB(
    `SELECT * FROM mate WHERE matestate = TRUE AND ((req_idx=${idx} AND res_idx=${mateidx}) OR (req_idx=${mateidx} AND res_idx=${idx}))`
  );
  if (query1.length === 1) {
    result.message = "mate";
    res.send(result);
    return;
  }

  //내가 보낸 요청이 있는지
  const query2 = await DB.runDB(
    `SELECT * FROM mate WHERE reqstate = 'R' AND (req_idx=${idx} AND res_idx=${mateidx})`
  );
  if (query2.length === 1) {
    result.message = "requested";
    res.send(result);
    return;
  }

  //상대방이 보낸 요청이 있는지
  const query3 = await DB.runDB(
    `SELECT * FROM mate WHERE reqstate = 'R' AND (req_idx=${mateidx} AND res_idx=${idx})`
  );
  if (query3.length === 1) {
    result.message = "requested";
    res.send(result);
    return;
  }

  result.message = "true";
  res.send(result);
});

router.post("/req", async (req, res) => {
  const idx = req.body.idx;
  const mateidx = req.body.mateidx;
  const result = {
    code: "success",
    message: "requested",
  };

  //상대방이 보낸 요청이 있는지
  const query2 = await DB.runDB(
    `SELECT * FROM mate WHERE reqstate = 'R' AND (req_idx=${mateidx} AND res_idx=${idx})`
  );
  if (query2.length === 1) {
    result.code = "error";
    result.message = "이미 요청된 신청입니다.";
    res.send(result);
    return;
  }

  //이미 삭제한 친구인지 -> 다시 친추
  const query3 = await DB.runDB(
    `SELECT * FROM mate WHERE reqstate = 'D' AND ((req_idx=${idx} AND res_idx=${mateidx}) OR (req_idx=${mateidx} AND res_idx=${idx}))`
  );
  if (query3.length === 1) {
    if (query3[0].req_idx === idx && query3[0].res_idx === mateidx) {
      const query = await DB.runDB(
        `UPDATE mate SET reqstate='R' WHERE req_idx=${idx} AND res_idx=${mateidx}`
      );
      res.send(result);
      return;
    } else if (query3[0].res_idx === idx && query3[0].req_idx === mateidx) {
      const query = await DB.runDB(
        `UPDATE mate SET req_idx=${idx},res_idx=${mateidx},reqstate='R' WHERE req_idx=${mateidx} AND res_idx=${idx}`
      );
      res.send(result);
      return;
    }
  }

  const queryresult = await DB.runDB(
    `INSERT INTO mate(req_idx,res_idx,reqstate) VALUES(${idx},${mateidx},'R');`
  );

  res.send(result);
});

router.post("/delete", async (req, res) => {
  const idx = req.body.idx;
  const mateidx = req.body.mateidx;
  const result = {
    code: "success",
    message: "메이트 삭제 완료",
  };

  const query = await DB.runDB(
    `UPDATE mate SET reqstate='D', matestate = FALSE WHERE (req_idx=${idx} AND res_idx=${mateidx}) OR(req_idx=${mateidx} AND res_idx=${idx})`
  );
  res.send(result);
});

module.exports = router;
