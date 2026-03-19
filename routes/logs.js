const express = require("express");
const router = express.Router();
const { analyzeLogs } = require("../utils/logAnalyzer");

router.get("/alerts", async (req, res) => {
  const result = await analyzeLogs();

  res.json({
    success: true,
    data: result,
  });
});

module.exports = router;
