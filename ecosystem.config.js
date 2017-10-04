const ignoreArr = [
  `.git`,
  `.gitignore`,
  `.idea`,
  `.eslintrc.js`,
  `.eslintignore`,
  `**/*.log`,
  `**/*.md`,
  `[\\/\\\\]\\./`,
  `cron`,
  `docs`,
  `migration`,
  `node_modules`,
  `public`,
  `test`,
]

module.exports = {
  apps: [{
    name: `caro-back-${process.env.NODE_ENV || `dev`}`,
    script: `./app.js`,
    watch: true,
    ignore_watch: ignoreArr,
    env: {
      NODE_PATH: `./`
    }
  }]
}
