const config = require("better-config");
const fetch = require("node-fetch");
const logger = require("./utils/logger");
const sleep = require("./utils/sleep");

config.set(`../${process.env.CRASH_COURSE_CONFIG_FILE || "config.json"}`);

const CHECKIN_RECEIVER_URL = `http://localhost:${config.checkinReceiver.port}/api/checkin`;

const randomInRange = (min, max) =>
  Math.ceil(Math.random() * (max - min) + min);

const generateCheckin = async () => {
  const checkin = {
    userId: randomInRange(1, 5),
    itemId: randomInRange(1, 25),
    starRating: randomInRange(0, 4),
  };

  const response = await fetch(CHECKIN_RECEIVER_URL, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(checkin),
  });

  if (response.status === 200) {
    logger.info(
      `Generated checkin for user ${checkin.userId} at location ${checkin.itemId} with vote ${checkin.starRating}.`
    );
  } else {
    logger.error(`${response.status} error recording checkin.`);
  }
};

const runCheckinGenerator = async () => {
  logger.info("Started checkin generator.");

  // Infinitely generate checkins...
  /* eslint-disable no-constant-condition */
  while (true) {
    /* eslint-enable */
    /* eslint-disable no-await-in-loop */
    await sleep.randomSleep(1, 1);
    await generateCheckin();
    /* estlint-enable */
  }
};

runCheckinGenerator();
