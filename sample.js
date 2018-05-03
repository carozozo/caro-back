/*
 `TARGET=xxx  npm run sample`
 找出所有 .sample 檔案, 並複製成 .js 檔案

 `TARGET=xxx  npm run sample:model`
 找出 model 相關的 .sample 檔案, 並複製成 .js 檔案

 `TARGET=xxx  npm run sample:route`
 找出 route 相關的 .sample 檔案, 並複製成 .js 檔案

 `TARGET=xxx  npm run sample.delete`
 找出所有 .sample 對應的檔案, 並移除對應的 .js 檔案

 `TARGET=xxx  npm run sample.delete:model`
 找出 model 相關的 .sample 檔案, 並移除對應的 .js 檔案

 `TARGET=xxx  npm run sample.delete:route`
 找出 route 相關的 .sample 檔案, 並移除對應的 .js 檔案
*/
const _ = require(`caro`)
const fs = require(`fs`)
const path = require(`path`)
const targetName = process.env.TARGET
const sampleType = process.env.SAMPLE_TYPE
const isDelete = process.env.IS_DELETE

if (!targetName) {
  console.error(`
    請輸入
    'TARGET=xxx npm run sample'              建立相關檔案
    'TARGET=xxx npm run sample:model'        建立 model 相關檔案
    'TARGET=xxx npm run sample:route'        建立 route 相關檔案
    'TARGET=xxx npm run sample.delete'       移除相關檔案
    'TARGET=xxx npm run sample.delete:model' 移除 model 相關檔案
    'TARGET=xxx npm run sample.delete:route' 移除 route 相關檔案
  `)
  process.exit()
}

const getFilePathFromSample = (samplePath) => {
  const dirPath = path.dirname(samplePath)
  const fileName = path.basename(samplePath)
    .replace(`__`, _.upperFirst(targetName)) // e.g. __Ctr.sample => UserCtr.sample
    .replace(`_`, targetName) // e.g. _Ctr.sample => userCtr.sample
    .replace(`.sample`, `.js`)
  return path.join(dirPath, fileName)
}
const createFile = (samplePath) => {
  let data = fs.readFileSync(samplePath, `utf8`)
  data = _.replaceAll(data, `$sample$`, targetName)
  data = _.replaceAll(data, `$Sample$`, _.upperFirst(targetName))

  const filePath = getFilePathFromSample(samplePath)
  fs.writeFileSync(filePath, data)
  console.log(`已建立 ${filePath}`)
}
const deleteFile = (samplePath) => {
  const filePath = getFilePathFromSample(samplePath)
  if (!fs.existsSync(filePath)) return
  fs.unlinkSync(filePath)
  console.log(`已移除 ${filePath}`)
}
const getSampleFile = (fileOrDir) => {
  fileOrDir = path.relative(`./`, fileOrDir)
  if (!fs.existsSync(fileOrDir)) return

  const stat = fs.statSync(fileOrDir)
  if (stat.isFile() && fileOrDir.endsWith(`.sample`)) {
    if (!isDelete) return createFile(fileOrDir)
    return deleteFile(fileOrDir)
  }
  if (stat.isDirectory()) {
    const fileArr = fs.readdirSync(fileOrDir)
    _.forEach(fileArr, (file) => {
      const filePath = path.join(fileOrDir, file)
      getSampleFile(filePath)
    })
  }
}

if (!sampleType) {
  getSampleFile(`app/module`)
  getSampleFile(`app/route`)
  getSampleFile(`app/model`)
  getSampleFile(`test/spec`)
  return
}

if (sampleType === `route`) {
  getSampleFile(`app/module/controller`)
  getSampleFile(`app/module/service`)
  getSampleFile(`app/route`)
  getSampleFile(`test/spec/route`)
  getSampleFile(`test/spec/controller`)
  getSampleFile(`test/spec/service`)
  return
}

if (sampleType === `model`) {
  getSampleFile(`app/model`)
  getSampleFile(`test/spec/model`)
  return
}