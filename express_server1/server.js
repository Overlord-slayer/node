const express = require('express')
const path = require('path')
const cors = require('cors')

const { logger } = require('./middleware/logEvents')
const { errorHandler } = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')

const app = express()
const PORT = process.env.PORT || 3000

// custom middleware logger
app.use(logger)
// Cross origin resources sharing

app.use(cors(corsOptions))

// * built-in middleware to handle urlenconded data form data
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')))

// routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/employees', require('./routes/api/employees'))


// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
  console.log('attempted to load hello.html')
  next()
}, (req, res) => {
  res.send('Hola mundo')
})

// chaining route handlers
// const one = (req, res, next) => {
//   console.log('one')
//   next()
// }

// const two = (req, res, next) => {
//   console.log('two')
//   next()
// }

// const three = (req, res) => {
//   console.log('Three')
//   res.send('Finished!')
// }

// app.get('/chain(.html)?', [one, two, three])

app.all('*', (req, res) => {
  //res.sendFile('./views/index.html', { root: __dirname })
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: "404 not found" })
  } else {
    res.type('txt').send( "404 not found")
  }
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
