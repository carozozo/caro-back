/* 定義一些通用的 apidoc */

const name = `authHeader`
ck.apiDoc.outputDefine(name, ck.apiDoc.genHeader({
  type: `string`,
  field: `Authorization`,
  desc: `CaroAuth token of each request`
}))
