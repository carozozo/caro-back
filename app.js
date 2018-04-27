const cupLength = require(`os`).cpus().length
const cluster = require(`cluster`)
const CaroBack = require(`ck`)
global._ = require(`caro`)
global.ck = new CaroBack()

if (cluster.isMaster && process.env.CLUSTER === `true`) {
  console.log(`master #${process.pid} is running`)
  for (let i = 0; i < Math.max(cupLength, 1); ++i) {
    console.log(`Start fork worker [${i}]`)
    process.env.WORKER_INDEX = i // 寫入 process.env 讓 fork 出來的 worker process 使用
    cluster.fork()
  }

  cluster.on(`online`, (worker) => {
    console.log(`Worker #${worker.process.pid} online`)
  })
  cluster.on(`exit`, (worker) => {
    console.log(`Worker #${worker.process.pid} exit`)
  })
} else {
  ck.requireDir(`module`)
  ck.requireDir(`route`)
  ck.requireDir(`boot`)
  ck.boot.runStacks()
}
