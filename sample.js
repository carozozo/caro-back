// 從 app 資料夾中找出 .sample 檔案, 並複製新的內容; 或是移除指定的相關檔案
const _ = require(`caro`)
const fs = require(`fs`)
const path = require(`path`)
const targetName = process.env.TARGET
const isDelete = process.env.IS_DELETE

if (!targetName) {
  console.error(`
  請輸入 'TARGET={{想建立的檔名}} npm run sample' 建立目標相關檔案
  或 'TARGET={{想移除的檔名}} npm run sample:delete' 移除目標相關檔案
  `)
  process.exit()
}

const getFilePathFromSample = (samplePath) => {
  const dirPath = path.dirname(samplePath)
  const fileName = path.basename(samplePath)
    .replace(`__`, _.upperFirst(targetName)) // e.g. __Dat.sample => UserDat.sample
    .replace(`_`, targetName) // e.g. _dat.sample => userDat.sample
    .replace(`.sample`, `.js`)
  return path.join(dirPath, fileName)
}
const createFile = (samplePath) => {
  let data = fs.readFileSync(samplePath, `utf8`)
  data = _.replaceAll(data, `sample`, targetName)
  data = _.replaceAll(data, `Sample`, _.upperFirst(targetName))

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

getSampleFile(`app`)
getSampleFile(`test/spec`)
