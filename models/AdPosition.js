const mongoose = require('mongoose');

// 广告位置模型（支持动态增减）
const adPositionSchema = new mongoose.Schema({
  // 位置名称（如"置顶广告"、"右侧横幅"）
  name: {
    type: String,
    required: [true, '广告位置名称不能为空'],
    trim: true,
    unique: true
  },
  // 位置标识（用于前端渲染）
  key: {
    type: String,
    required: [true, '位置标识不能为空'],
    trim: true,
    unique: true,
    lowercase: true
  },
  // 位置样式
  style: {
    backgroundColor: { type: String, default: '#fff' },
    borderColor: { type: String, default: '#ddd' },
    titleColor: { type: String, default: '#333' },
    titleBgColor: { type: String, default: '#f5f5f5' }
  },
  // 排序权重
  sort: {
    type: Number,
    default: 0,
    min: 0
  },
  // 是否启用
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdPosition', adPositionSchema);
