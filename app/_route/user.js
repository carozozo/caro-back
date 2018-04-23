const group = `user`
const groupPath = ck.api.getGroupPath(group)
const router = ck.api.createRouter(groupPath)

router.post(`/register`, ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`data`, `profileData`, `authMethod`])
  const data = args.data
  const profileData = args.profileData
  const authMethod = args.authMethod

  const result = await ck.userCtr.register(data, profileData, authMethod)
  res.suc(result)
}))

router.post(`/login`, ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`username`, `pwd`])
  const username = args.username
  const pwd = args.pwd

  const result = await ck.userCtr.login(username, pwd)
  res.suc(result)
}))

router.post(`/logout`, ck.auth.authRole(), ck.genRouteFn(async (req, res) => {
  const result = await ck.userCtr.logout(req.reqUser)
  res.suc(result)
}))

router.post(`/updateById`, ck.auth.authRole(), ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`id`, `data`])
  const id = args.id
  const data = args.data

  const result = await ck.userCtr.updateById(req.reqUser, id, data)
  res.suc(result)
}))

router.get(`/getById`, ck.auth.authRole(`stuff`, `manager`, `admin`), ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req, [`id`])
  const id = args.id

  const result = await ck.userCtr.getById(id)
  res.suc(result)
}))

router.get(`/getList`, ck.auth.authRole(`stuff`, `manager`, `admin`), ck.genRouteFn(async (req, res) => {
  const args = ck.req.validateRequired(req)

  const result = await ck.userCtr.getList(args)
  res.suc(result)
}))
