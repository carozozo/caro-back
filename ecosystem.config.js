require(`dotenv`).config()

const ignoreArr = [
  `.git`,
  `.gitignore`,
  `.idea`,
  `.eslintrc.js`,
  `.eslintignore`,
  `**/*.log`,
  `**/*.md`,
  `[\\/\\\\]\\./`,
  `docker`,
  `docs`,
  `migration`,
  `node_modules`,
  `public`,
  `test`,
]
const nodePath = `./`

module.exports = {
  apps: [{
    name: `caro-back-${process.env.NODE_ENV || `dev`}`,
    script: `./app.js`,
    watch: true,
    ignore_watch: ignoreArr,
    env: {
      NODE_PATH: nodePath
    }
  }, {
    name: `caro-back-cron-${process.env.NODE_ENV || `dev`}`,
    script: `./cron/app.js`,
    watch: true,
    ignore_watch: ignoreArr,
    env: {
      NODE_PATH: nodePath
    }
  }],
}