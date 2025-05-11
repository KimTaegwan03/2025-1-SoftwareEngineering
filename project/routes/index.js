var express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index')
});

router.post("/text", (req, res) => {  //데이터 받는 곳
  // req
  const text1 = req.body.inText;
  console.log(text1);
  
  // res
  const sendText = {
  	text : "전송 성공!!!",
  };
  res.send(sendText);
});

module.exports = router;
