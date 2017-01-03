const group = `user`
const groupPath = ck.api.getGroupPath(group)
const router = ck.api.createRouter(groupPath)

router.post(`/register`, ck.genRouteFn(async (req, res) => {
  const args = ck.req.getReqArgs(req, [`data`, `profileData`, `authMethod`])
  const data = args.data
  const profileData = args.profileData
  const authMethod = args.authMethod
  const result = await new ck.UserSer().register(data, profileData, authMethod)
  res.suc(result)
}))
router.post(`/login`, ck.genRouteFn(async (req, res) => {
  const args = ck.req.getReqArgs(req, [`username`, `pwd`])
  const username = args.username
  const pwd = args.pwd
  const result = await new ck.UserSer().login(username, pwd)
  res.suc(result)
}))
router.get(`/getById`, ck.auth.authRole(`stuff`, `manager`, `admin`), ck.genRouteFn(async (req, res) => {
  const args = ck.req.getReqArgs(req, [`id`])
  const id = args.id
  const result = await new ck.UserSer().getById(id)
  res.suc(result)
}))
router.get(`/getList`, ck.auth.authRole(`stuff`, `manager`, `admin`), ck.genRouteFn(async (req, res) => {
  const args = ck.req.getReqArgs(req)
  const result = await new ck.UserSer().getList(args)
  res.suc(result)
}))
router.post(`/updateById`, ck.auth.authRole(), ck.genRouteFn(async (req, res) => {
  const args = ck.req.getReqArgs(req, [`id`, `data`])
  const id = args.id
  const data = args.data
  const result = await new ck.UserSer(req.reqUser).updateById(id, data)
  res.suc(result)
}))
