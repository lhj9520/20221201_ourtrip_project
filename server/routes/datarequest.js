const router = require("express").Router();
const request = require("request");
const converter = require("xml-js");

require("dotenv").config();

router.get("/list", (req, res) => {
  const { sido, gungu } = req.query;
  const url =
    "http://openapi.tour.go.kr/openapi/service/TourismResourceService/getTourResourceList";
  let queryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    `=${process.env.REACT_APP_OPENAPI_KEY}`; /* Service Key*/
  queryParams +=
    "&" + encodeURIComponent("SIDO") + "=" + encodeURIComponent(sido); /* */
  queryParams +=
    "&" + encodeURIComponent("GUNGU") + "=" + encodeURIComponent(gungu); /* */

  console.log(url + queryParams);
  console.log("open api 호출...");

  request(
    {
      url: url + queryParams,
      method: "GET",
    },
    function (error, response, body) {
      const xmlToJson = converter.xml2json(body);
      const tmpobj =
        JSON.parse(xmlToJson).elements[0].elements[1].elements[0].elements;
      const results = [];

      tmpobj.map((data, index) => {
        let obj = {};
        obj.category = data.elements[1].elements[0].text;
        obj.name = data.elements[2].elements[0].text;
        obj.sido = data.elements[3].elements[0].text;
        obj.gungu = data.elements[4].elements[0].text;
        results.push(obj);
      });

      res.send(results);

      console.log("open api 데이터 완료");
    }
  );
});

router.get("/more", (req, res) => {
  const { sido, gungu, name } = req.query;
  const url =
    "http://openapi.tour.go.kr/openapi/service/TourismResourceService/getTourResourceDetail";

  let queryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    `=${process.env.REACT_APP_OPENAPI_KEY}`; /* Service Key*/
  queryParams +=
    "&" + encodeURIComponent("SIDO") + "=" + encodeURIComponent(sido); /* */
  queryParams +=
    "&" + encodeURIComponent("GUNGU") + "=" + encodeURIComponent(gungu); /* */
  queryParams +=
    "&" + encodeURIComponent("RES_NM") + "=" + encodeURIComponent(name); /* */

  console.log(url + queryParams);
  console.log("open api 호출...");

  request(
    {
      url: url + queryParams,
      method: "GET",
    },
    function (error, response, body) {
      const xmlToJson = converter.xml2json(body);
      res.send(JSON.parse(xmlToJson));
      console.log("open api 데이터 완료");
    }
  );
});

module.exports = router;
