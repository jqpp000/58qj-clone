require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key', // 建议在.env文件中设置
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// 设置视图引擎
app.set('view engine', 'ejs');

// 基础路由
app.get('/', (req, res) => {
  res.send('服务器已启动，这是首页');
});

// 连接数据库并启动服务器
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/58qj-clone')
  .then(() => {
    console.log('MongoDB连接成功');
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });
