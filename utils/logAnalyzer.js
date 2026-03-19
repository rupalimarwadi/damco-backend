const fs = require("fs");
const path = require("path");
const readline = require("readline");

const LOG_DIR = path.join(__dirname, "../logs");

// Ensure logs folder exists
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }
}

// Get today's log file
function getLogFilePath() {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  return path.join(LOG_DIR, `${today}.log`);
}

// Write log (append)
function writeLog(ip, status) {
  ensureLogDir();

  const filePath = getLogFilePath();
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);

  const logLine = `${timestamp} IP=${ip} STATUS=${status}\n`;

  fs.appendFileSync(filePath, logLine);
}

// Analyzer
async function analyzeLogs() {
  ensureLogDir();

  const filePath = getLogFilePath();

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const failedAttempts = new Map();

  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const parts = line.trim().split(" ");

    const timestamp = new Date(`${parts[0]} ${parts[1]}`);
    const ip = parts[2].split("=")[1];
    const status = parts[3].split("=")[1];

    if (status === "FAILED") {
      if (!failedAttempts.has(ip)) {
        failedAttempts.set(ip, []);
      }
      failedAttempts.get(ip).push(timestamp);
    }
  }

  const suspiciousIPs = [];

  for (const [ip, timestamps] of failedAttempts.entries()) {
    timestamps.sort((a, b) => a - b);

    let left = 0;

    for (let right = 0; right < timestamps.length; right++) {
      while (
        timestamps[right] - timestamps[left] > 10 * 60 * 1000
      ) {
        left++;
      }

      const count = right - left + 1;

      if (count > 5) {
        suspiciousIPs.push({
          ip,
          failedAttempts: count,
          firstDetected: timestamps[left],
        });
        break;
      }
    }
  }

  return suspiciousIPs;
}

module.exports = {
  analyzeLogs,
  writeLog
};
