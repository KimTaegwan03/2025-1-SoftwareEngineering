var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const { sequelize } = require('./models');


//   .then(() => console.log('✅ DB 테이블 재생성 완료'))
//   .catch(err => console.error('❌ DB 동기화 실패:', err));
sequelize.sync({ alter: true })
  .then(() => console.log('✅ DB 동기화 완료'))
  .catch((err) => console.error('❌ DB 동기화 실패:', err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var noticeRouter = require('./routes/notice');
const announcementRouter = require('./routes/announcement');
const assignmentRouter = require('./routes/assignment');
const questionRouter = require('./routes/question');
const answerRouter = require('./routes/answer');
var graderouter = require('./routes/grade');
const lectureRouter = require('./routes/lecture');
const syllabusRouter = require('./routes/syllabus');
const enrollRouter = require('./routes/enroll');
const statRouter = require('./routes/stat');
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
app.use('/notice', noticeRouter);
app.use('/announcement', announcementRouter);
app.use('/assignment', assignmentRouter);
app.use('/question', questionRouter);
app.use('/answer', answerRouter);
app.use('/grade', graderouter);
app.use('/lecture', lectureRouter);
app.use('/syllabus', syllabusRouter);
app.use('/enroll', enrollRouter);
app.use('/stats', statRouter);

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