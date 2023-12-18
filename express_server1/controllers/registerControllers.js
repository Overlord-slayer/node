const bcrypt = require('bcrypt')

const User = require('../model/User')

const handlerNewUser = async (req, res) => {
  const { user, pwd } = req.body
  if (!user || !pwd) return res.status(400).json({ 'message': 'User name and password are required' })
  // verificar por duplicados en la db
  const duplicate = await User.findOne({ username: user }).exec()
  if (duplicate) return res.sendStatus(409) // Conflict
  try {
    // encriptar la contraseña
    const hashedPwd = await bcrypt.hash(pwd, 10)
    // crear y almacenar el nuevo usuario
    const result = await User.create({ 
      "username": user, 
      "password": hashedPwd
    })
    console.log(result)
    res.status(201).json({ 'success': `New user ${user} created!` })
  } catch (err) {
    res.status(500).json({ 'message': err.message })
  }
}

module.exports = { handlerNewUser }