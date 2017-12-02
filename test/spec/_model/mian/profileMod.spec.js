describe(`profileMod`, () => {
  let profileMod
  let profileFak

  before(() => {
    profileMod = ck.profileMod
    profileFak = ck.profileFak
  })

  describe(`createProfile`, () => {
    it(``, async () => {
      const $user = await ck.userFak.fake()
      const role = $user.role
      const username = $user.username
      const _profile = profileFak.genCreate({user_username: username})
      const $profile = await profileMod.createProfile(role, _profile)
      assert.equal($profile.name, _profile.name)
    })
    it(`should got error if no relative to user`, async () => {
      const username = `userNotExists`
      const _profile = profileFak.genCreate({user_username: username})
      await assert.shouldGotErr(async () => {
        await profileMod.createProfile(`admin`, _profile)
      })
    })
    it(`should got error if no email when relative user role is customer/stuff/manager`, async () => {
      const rolesNeedEmail = profileMod.rolesNeedEmail
      for (const role of rolesNeedEmail) {
        const $user = await ck.userFak.fake({role})
        const username = $user.username
        await assert.shouldGotErr(async () => {
          const _profile = profileFak.genCreate({user_username: username, email: undefined})
          await profileMod.createProfile(role, _profile)
        })
      }
    })
  })
})
