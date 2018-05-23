const group = `user`
const groupPath = ck.apiServer.getGroupPath(group)
const router = ck.apiServer.createRouter(groupPath)

router.post(`/register`, ck.apiServer.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`data`, `profileData`, `authMethod`])
  const data = args.data
  const profileData = args.profileData
  const authMethod = args.authMethod

  const result = await ck.userCtr.register(data, profileData, authMethod)
  res.suc(result)
}))

router.post(`/login`, ck.apiServer.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`username`, `pwd`])
  const username = args.username
  const pwd = args.pwd

  const result = await ck.userCtr.login(username, pwd)
  res.suc(result)
}))

router.post(`/logout`, ck.auth.authRole(), ck.apiServer.genRouteFn(async (req, res) => {
  const result = await ck.userCtr.logout(req.reqUser)
  res.suc(result)
}))

router.post(`/updateById`, ck.auth.authRole(), ck.apiServer.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`id`, `data`])
  const id = args.id
  const data = args.data

  const result = await ck.userCtr.updateById(req.reqUser, id, data)
  res.suc(result)
}))

router.get(`/getById`, ck.auth.authRole(`staff`, `manager`, `admin`), ck.apiServer.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`id`])
  const id = args.id

  const result = await ck.userCtr.getById(id, args)
  res.suc(result)
}))

router.get(`/getList`, ck.auth.authRole(`staff`, `manager`, `admin`), ck.apiServer.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req)
  const username = args.username

  const result = await ck.userCtr.getList({username}, args)
  res.suc(result)
}))
