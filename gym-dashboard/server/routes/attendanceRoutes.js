const express = require('express');
const Attendance = require('../models/Attendance');
const router = express.Router();

router.post('/:memberId', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      memberId: req.params.memberId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existing) {
      return res.status(400).json({ message: 'Already marked present today' });
    }

    const record = new Attendance({ memberId: req.params.memberId });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:memberId', async (req, res) => {
  try {
    const records = await Attendance.find({ memberId: req.params.memberId }).sort({ date: -1 });
    res.json({ count: records.length, records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:memberId/month/:year/:month', async (req, res) => {
  try {
    const { memberId, year, month } = req.params;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    const records = await Attendance.find({
      memberId,
      date: { $gte: start, $lte: end },
    });
    const days = records.map((r) => new Date(r.date).getDate());
    res.json({ days, count: days.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
