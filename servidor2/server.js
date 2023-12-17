const http = require('http')

const servidoer = http.createServer((req, res) => {
  console.log('===> req (solicitud)')
  // console.log(req.url)
  // console.log(req.method)
  // console.log(req.headers)

  console.log(res.statusCode)
  // res.statusCode = 404
  // console.log(res.statusCode)

  res.setHeader('content-type', 'application/json')
  console.log(res.getHeaders())
  res.end('Hola mundo')
})

const PUERTO = 3000

servidoer.listen(PUERTO, () => {
  console.log(`El servidor esta escuchando en el puerto  ${PUERTO}...`)
})