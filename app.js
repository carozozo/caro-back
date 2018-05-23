require(`ck`)

const cpuLength = require(`os`).cpus().length
const cluster = require(`cluster`)

let clusterNum = parseInt(process.env.CLUSTER, 10)
if (clusterNum <= 0) clusterNum = Math.max(cpuLength + clusterNum, 1)
else Math.min(clusterNum, cpuLength)

if (cluster.isMaster && clusterNum > 1) {
  console.log(`master #${process.pid} is running`)
  for (let i = 0; i < clusterNum; ++i) {
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
  ck.require(`boot`)
  ck.boot.runStacks()
}
