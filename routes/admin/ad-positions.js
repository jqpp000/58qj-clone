const express = require('express');
const router = express.Router();
const AdPosition = require('../../models/AdPosition');

// 管理员验证
const isAdmin = (req, res, next) => {
  // 简化测试，直接通过
  next();
};

// 广告位置管理首页
router.get('/', isAdmin, async (req, res) => {
  try {
    const positions = await AdPosition.find().sort({ sort: -1 }).lean();
    res.render('admin/ad-positions', {
      title: '广告位置管理 - 58信息网后台',
      positions
    });
  } catch (err) {
    req.flash('error_msg', '获取广告位置失败');
    res.redirect('/admin/ad-positions');
  }
});

// 添加广告位置页面
router.get('/add', isAdmin, (req, res) => {
  res.render('admin/ad-position-add', {
    title: '添加广告位置 - 58信息网后台'
  });
});

// 处理添加广告位置
router.post('/add', isAdmin, async (req, res) => {
  try {
    const newPosition = new AdPosition({
      name: req.body.name,
      key: req.body.key,
      style: {
        backgroundColor: req.body.backgroundColor || '#fff',
        borderColor: req.body.borderColor || '#ddd',
        titleColor: req.body.titleColor || '#333',
        titleBgColor: req.body.titleBgColor || '#f5f5f5'
      },
      sort: Number(req.body.sort) || 0
    });
    
    await newPosition.save();
    req.flash('success_msg', '广告位置添加成功');
    res.redirect('/admin/ad-positions');
  } catch (err) {
    req.flash('error_msg', `添加失败：${err.message}`);
    res.redirect('/admin/ad-positions/add');
  }
});

// 删除广告位置
router.get('/delete/:id', isAdmin, async (req, res) => {
  try {
    await AdPosition.findByIdAndDelete(req.params.id);
    req.flash('success_msg', '广告位置已删除');
  } catch (err) {
    req.flash('error_msg', `删除失败：${err.message}`);
  }
  res.redirect('/admin/ad-positions');
});

module.exports = router;
