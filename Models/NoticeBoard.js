// const mongoose = require('mongoose');

// const NoticeboardSchema = new mongoose.Schema({
//     recipients:[String],
//     Notice: String
// });

// const NoticeBoard = mongoose.model('NoticeBoard', NoticeboardSchema);
// module.exports = NoticeBoard;




const mongoose = require('mongoose');

const NoticeboardSchema = new mongoose.Schema(
  {
    notice: {
      type: String,
      required: true, // Notice text is mandatory
      trim: true,
    },
    recipients: {
      type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds for group recipients
      ref: 'signup', // Reference to the User model
      default: [], // Default to an empty array
    },
    individualRecipients: {
      type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds for individual recipients
      ref: 'signup', // Reference to the User model
      default: [], // Default to an empty array
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the creation timestamp
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const NoticeBoard = mongoose.model('NoticeBoard', NoticeboardSchema);
module.exports = NoticeBoard;