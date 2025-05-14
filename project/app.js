var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const sequelize = require('./db');
const User = require('./models/User');
const Student = require('./models/Student');
const Instructor = require('./models/Instructor');

const lectureRouter = require('./routes/lecture');
const syllabusRouter = require('./routes/syllabus');
const enrollRouter = require('./routes/enroll');

// sequelize.sync()
//   .then(() => console.log('DB 연결 및 테이블 동기화 완료'))
//   .catch((err) => console.error('DB 연결 실패:', err));
sequelize.sync()//{ force: true }
  .then(() => console.log('✅ DB 테이블 재생성 완료'))
  .catch(err => console.error('❌ DB 동기화 실패:', err));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // 세션 쿠키 공유 허용
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'swe8', // 아무 문자열이면 충분 (개인 프로젝트용)
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
// lecture API 등록
app.use('/lecture', lectureRouter);
app.use('/syllabus', syllabusRouter);
app.use('/enroll', enrollRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
