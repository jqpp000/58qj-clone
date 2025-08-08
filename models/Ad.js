const mongoose = require('mongoose');

// 广告内容模型
const adSchema = new mongoose.Schema({
  // 关联广告位置
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdPosition',
    required: [true, '必须选择广告位置']
  },
  title: { 
    type: String, 
    required: [true, '广告标题不能为空'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, '广告描述不能为空'] 
  },
  imageUrl: { 
    type: String, 
    required: [true, '广告图片URL不能为空'] 
  },
  tags: [{ 
    type: String,
    trim: true 
  }],
  link: { 
    type: String, 
    required: [true, '广告链接不能为空'] 
  },
  sort: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 索引优化查询
adSchema.index({ positionId: 1, isActive: 1, sort: -1 });

module.exports = mongoose.model('Ad', adSchema);
