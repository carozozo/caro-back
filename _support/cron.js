/* 提供 caro-back Cron Job 服務 */
const cfg = ck.config.cron
const timezone = cfg.timezone
module.exports = new ck.Cron({timezone})
