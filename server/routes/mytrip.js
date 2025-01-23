const router = require("express").Router();
var path = process.cwd();
const DB = require(path + "/lib/db");

router.post("/triplist", async (req, res) => {
  const idx = req.body.idx;

  const result = {
    code: "success",
    message: "여행 목록 업데이트",
    trip: "",
  };

  const queryresult = await DB.runDB(
    `SELECT trip.*,mem_nickname AS host_nickname FROM trip,user WHERE JSON_EXTRACT( mate_idx, '$."${idx}"' ) IS NOT NULL AND mem_idx = host_idx`
  );

  result.trip = queryresult.reverse();
  res.send(result);
});

router.post("/planlist", async (req, res) => {
  //해당 여행 + 여행에 저장된 타임라인 리스트
  const seq = req.body.seq;
  const idx = req.body.idx;

  const result = {
    code: "success",
    message: seq + "번째 여행",
    trip: null,
    timeline: null,
  };

  const queryresult = await DB.runDB(
    `SELECT trip.*,mem_nickname AS host_nickname FROM trip,user WHERE JSON_EXTRACT( mate_idx, '$."${idx}"' ) IS NOT NULL AND mem_idx = host_idx AND seq = ${seq}`
  );

  if (queryresult.length === 0) {
    result.code = "error";
    result.message = "해당 여행 데이터가 없습니다.";
    res.send(result);
    return;
  }

  result.trip = queryresult[0];

  const timelinequeryresult = await DB.runDB(
    `SELECT timeline.*,mem_nickname AS writer_nickname FROM timeline,user WHERE trip_seq = ${seq} AND mem_idx = writer ORDER BY seq`
  );

  result.timeline = timelinequeryresult;
  res.send(result);
});

router.post("/timelineadd", async (req, res) => {
  const { tripseq, title, start, end, day, writer, daylist, curidx } = req.body;
  const result = {
    code: "success",
    message: "타임라인 추가",
  };

  const queryresult = await DB.runDB(
    `INSERT INTO timeline(trip_seq,title,start,end,day,writer,daylist,reg_time,curidx) VALUES (${tripseq},'${title}','${start}','${end}',${day},${writer},'${JSON.stringify(
      daylist
    )}',NOW(),${curidx})`
  );

  const query = await DB.runDB(
    `UPDATE trip SET update_time=NOW() WHERE seq = ${tripseq}`
  );

  res.send(result);
});

router.post("/timelineupdate", async (req, res) => {
  const { seq, tripseq, title, start, end, day, writer, daylist, curidx } =
    req.body;

  const result = {
    code: "success",
    message: "타임라인 수정",
  };

  const queryresult = await DB.runDB(
    `UPDATE timeline SET title='${title}',start='${start}',end='${end}',day=${day},daylist='${JSON.stringify(
      daylist
    )}',update_time=NOW(),curidx=${curidx} WHERE seq=${seq}`
  );
  const query = await DB.runDB(
    `UPDATE trip SET update_time=NOW() WHERE seq = ${seq}`
  );
  res.send(result);
});

router.post("/timelinedelete", async (req, res) => {
  const seq = req.body.seq;

  const result = {
    code: "success",
    message: "타임라인 삭제 완료",
  };

  const queryresult = await DB.runDB(`DELETE FROM timeline WHERE seq = ${seq}`);
  const query = await DB.runDB(
    `UPDATE trip SET update_time=NOW() WHERE seq = ${seq}`
  );
  res.send(result);
});

router.post("/tripadd", async (req, res) => {
  const title = req.body.title;
  const idx = req.body.host_idx;
  const mate = JSON.stringify(req.body.mate_idx);

  const result = {
    code: "success",
    message: "여행 추가",
  };

  const queryresult = await DB.runDB(
    `INSERT INTO trip(title,reg_time,update_time,host_idx,mate_idx) VALUES ('${title}',NOW(),NULL,${idx},'${mate}');
      `
  );

  res.send(result);
});

router.post("/tripupdate", async (req, res) => {
  const seq = req.body.seq;
  const title = req.body.title;
  const mate = JSON.stringify(req.body.mate_idx);

  const result = {
    code: "success",
    message: "타이틀 변경 성공",
  };

  const query = await DB.runDB(
    `UPDATE trip SET title="${title}", mate_idx='${mate}',update_time=NOW() WHERE seq = ${seq}`
  );

  res.send(result);
});

router.post("/tripdelete", async (req, res) => {
  const seq = req.body.seq;

  const result = {
    code: "success",
    message: "여행 삭제 완료",
  };

  const queryresult = await DB.runDB(`DELETE FROM trip WHERE seq = ${seq}`);

  res.send(result);
});

router.post("/tripexcept", async (req, res) => {
  const seq = req.body.seq;
  const idx = req.body.idx;

  const result = {
    code: "success",
    message: "여행 나가기 완료",
  };

  const mate_idx = await DB.runDB(
    `SELECT mate_idx FROM trip WHERE seq = ${seq}`
  );
  const tmp = { ...JSON.parse(mate_idx[0].mate_idx) };
  delete tmp[idx];

  const queryresult = await DB.runDB(
    `UPDATE trip SET mate_idx = '${JSON.stringify(tmp)}' WHERE seq = ${seq}`
  );

  res.send(result);
});

router.post("/triptitlechange", async (req, res) => {
  const seq = req.body.seq;
  const title = req.body.title;

  const result = {
    code: "success",
    message: "타이틀 변경 성공",
  };

  if (title === "") {
    const query = await DB.runDB(
      `UPDATE trip SET title=DATE_FORMAT(NOW(), "%y-%m-%d %H:%i 작성"),update_time=NOW() WHERE seq = ${seq}`
    );
    res.send(result);
    return;
  }
  const query = await DB.runDB(
    `UPDATE trip SET title="${title}",update_time=NOW() WHERE seq = ${seq}`
  );
  res.send(result);
});

module.exports = router;
