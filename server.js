require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const cors = require('cors');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 连接MongoDB数据库
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB数据库连接成功'))
.catch(err => {
  console.error('❌ 数据库连接失败:', err);
  // 连接失败时重试
  setTimeout(() => {
    mongoose.connect(process.env.MONGODB_URI);
  }, 5000);
});

// 配置视图引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 配置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 会话有效期1天
}));
app.use(flash());

// 全局变量
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  next();
});

// 路由配置
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin/ads'));
app.use('/admin/ad-positions', require('./routes/admin/ad-positions'));

// 404页面
app.use((req, res) => {
  res.status(404).render('404', { title: '页面未找到' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器已启动：http://localhost:${PORT}`);
  console.log(`📌 管理后台：http://localhost:${PORT}/admin`);
});
