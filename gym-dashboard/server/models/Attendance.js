const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Attendance', attendanceSchema);
