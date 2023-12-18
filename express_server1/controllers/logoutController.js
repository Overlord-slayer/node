const User = require('../model/User')
  
const handlerLogout = async (req, res) => {
  // On Client, also delete the accessToken
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // no content
  const refreshToken = cookies.jwt

  // Is refresh token in db?
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (!foundUser) {
    res.clearCookie(
      'jwt',
      {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      })
    return res.sendStatus(204)
  }

  // Delete refreshToken in db
  foundUser.refreshToken = ''
  const result = await foundUser.save()
  console.log(result)
  
  res.clearCookie(
    'jwt',
    {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    }) // secure: true - only serves on https
  res.sendStatus(204)
}

module.exports = { handlerLogout }