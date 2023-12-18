const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../model/User')

const handlerLogin = async (req, res) => {
  const { user, pwd } = req.body
  if (!user || !pwd) return res.status(400).json({ 'message': 'User name and password are required' })

  const foundUser = await User.findOne({ username: user }).exec()

  if (!foundUser) return res.sendStatus(401) // unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password)

  if (match) {
    const roles = Object.values(foundUser.roles)
    // create JWTs
    const accessToken = jwt.sign(
      { 
        "UserInfo": 
        {
          "username": foundUser.username,
          "roles":roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    )
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )
    // Guardando token de actualizacion con el usuario actual
    foundUser.refreshToken = refreshToken
    const result = await foundUser.save()
    console.log(result)

    /**
     * No tomar en cuenta secure, o la cookie no funcionara bien.
     * Esto si se esta testeando el refreshEndpoint con el refrehCookie
     */
    res.cookie(
      'jwt',
      refreshToken,
      {
        httpOnly: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000 
      }) // secure: true
    res.json({ accessToken })
  } else {
    res.sendStatus(401)
  }
}

module.exports = { handlerLogin }