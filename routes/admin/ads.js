const express = require('express');
const router = express.Router();
const Ad = require('../../models/Ad');
const AdPosition = require('../../models/AdPosition');

// 简单的管理员验证（实际项目需添加登录功能）
const isAdmin = (req, res, next) => {
  // 为了简化测试，这里直接通过，实际项目需要验证登录状态
  next();
};

// 广告管理首页
router.get('/', isAdmin, async (req, res) => {
  try {
    const positions = await AdPosition.find({ isActive: true }).sort({ sort: -1 }).lean();
    const adsByPosition = {};
    
    for (const pos of positions) {
      adsByPosition[pos._id] = await Ad.find({
        positionId: pos._id
      }).sort({ sort: -1 }).lean();
    }
    
    res.render('admin/ads', {
      title: '广告管理 - 58信息网后台',
      positions,
      adsByPosition
    });
  } catch (err) {
    req.flash('error_msg', '获取广告列表失败');
    res.redirect('/admin');
  }
});

// 添加广告页面
router.get('/add', isAdmin, async (req, res) => {
  try {
    const positions = await AdPosition.find({ isActive: true }).lean();
    res.render('admin/ad-add', {
      title: '添加广告 - 58信息网后台',
      positions
    });
  } catch (err) {
    req.flash('error_msg', '获取广告位置失败');
    res.redirect('/admin/ads');
  }
});

// 处理添加广告
router.post('/add', isAdmin, async (req, res) => {
  try {
    const newAd = new Ad({
      positionId: req.body.positionId,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(',').map(t => t.trim()).filter(Boolean),
      link: req.body.link,
      sort: Number(req.body.sort) || 0,
      isActive: req.body.isActive === 'on'
    });
    
    await newAd.save();
    req.flash('success_msg', '广告添加成功');
    res.redirect('/admin/ads');
  } catch (err) {
    req.flash('error_msg', `添加失败：${err.message}`);
    res.redirect('/admin/ads/add');
  }
});

// 删除广告
router.get('/delete/:id', isAdmin, async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    req.flash('success_msg', '广告已删除');
  } catch (err) {
    req.flash('error_msg', '删除失败');
  }
  res.redirect('/admin/ads');
});

// 管理员首页重定向
router.get('/', (req, res) => {
  res.redirect('/admin/ads');
});

module.exports = router;
