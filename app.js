const cupLength = require(`os`).cpus().length
const cluster = require(`cluster`)
const useCluster = true
const CaroBack = require(`ck`)
global.ck = new CaroBack({isWriteLog: true})

if (useCluster && cluster.isMaster && !process.env.TEST_MODE) {
  ck.info(`master #${process.pid} is running`)
  for (let i = 0; i < Math.max(cupLength, 1); ++i) {
    ck.info(`Start fork worker [${i}]`)
    process.env.WORKER_INDEX = i // 寫入 process.env 讓 fork 出來的 worker process 使用
    cluster.fork()
  }

  cluster.on(`online`, (worker) => {
    ck.info(`Worker #${worker.process.pid} online`)
  })
  cluster.on(`exit`, (worker) => {
    ck.info(`Worker #${worker.process.pid} exit`)
  })
} else {
  require(`init`)
  require(`boot`)
}
