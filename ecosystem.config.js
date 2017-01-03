module.exports = {
  apps: [{
    name: `caro-back-${process.env.NODE_ENV || `dev`}`,
    script: `./app.js`,
    watch: true,
    ignore_watch: [
      `.git`,
      `.gitignore`,
      `.idea`,
      `.eslintrc.js`,
      `.eslintignore`,
      `*.log`,
      `[\\/\\\\]\\./`,
      `docs`,
      `logs`,
      `migration`,
      `node_modules`,
      `public`,
      `test`,
    ],
    env: {
      NODE_PATH: `./`
    }
  }]
}
