const express = require('express');
const router = express.Router();

// 【关键修复】首页根路由：必须渲染 views/index.ejs 模板
router.get('/', (req, res) => {
  // 直接渲染模板，不添加任何多余的文本输出
  res.render('index', {
    title: '测试页面' // 传递标题变量（可选）
  });
});

// 其他路由...（保持不变）

module.exports = router;