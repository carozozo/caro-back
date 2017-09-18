const group = `user`
const groupPath = ck.api.getGroupPath(group)
const router = ck.api.createRouter(groupPath)

router.post(`/register`, ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`data`, `profileData`, `authMethod`])
  const data = args.data
  const profileData = args.profileData
  const authMethod = args.authMethod
  const result = await ck.userSer.register(data, profileData, authMethod)
  res.suc(result)
}))
router.post(`/login`, ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`username`, `pwd`])
  const username = args.username
  const pwd = args.pwd
  const result = await ck.userSer.login(username, pwd)
  res.suc(result)
}))
router.post(`/logout`, ck.genRouteFn(async (req, res) => {
  const username = req.reqUser.username
  const result = await new ck.userSer(req.reqUser).logout(username)
  res.suc(result)
}))
router.get(`/getById`, ck.auth.authRole(`stuff`, `manager`, `admin`), ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`id`])
  const id = args.id
  const result = await ck.userSer.getById(id)
  res.suc(result)
}))
router.get(`/getList`, ck.auth.authRole(`stuff`, `manager`, `admin`), ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req)
  const result = await ck.userSer.getList(args)
  res.suc(result)
}))
router.post(`/updateById`, ck.auth.authRole(), ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`id`, `data`])
  const id = args.id
  const data = args.data
  if (req.reqUser.ifCustomer() && !req.reqUser.ifSameId(id)) {
    throw `一般用戶只能更新自己的資料`
  }
  const result = await  ck.userSer.updateById(id, data)
  res.suc(result)
}))
