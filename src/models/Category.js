const mongoose = require('mongoose');

// 3-level nested category tree:
// level 1 = Parent (root, parentId = null)
// level 2 = Child  (parentId -> a level 1 category)
// level 3 = Leaf   (parentId -> a level 2 category) - only leaf categories may be assigned to books
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: 100,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    level: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, parentId: 1 }, { unique: true });

categorySchema.virtual('isLeaf').get(function isLeaf() {
  return this.level === 3;
});

categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);
