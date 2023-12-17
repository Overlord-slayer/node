const express = require('express');

const {programacion} = require('../datos/cursos.js').infoCursos;

const routerProgramacion = express.Router();

// MIDDLEWARE, Formatear el cuerpo de la solicitud en formato JSON
routerProgramacion.use(express.json())

routerProgramacion.get('/', (req, res) => {
  res.send(programacion)
});
  
routerProgramacion.get('/:lenguaje', (req, res) => {
  const lenguaje = req.params.lenguaje;
  const resultados = programacion.filter(curso => curso.lenguaje === lenguaje);
  
  if (resultados.length === 0) {
    return res.status(404).send(`No se encontraron cursos de ${lenguaje}.`);
  } 
  
  if (req.query.ordenar === 'vistas') {
    return res.send(resultados.sort((a, b) => b.vistas - a.vistas))
  }
  
  res.send(resultados)
});
  
routerProgramacion.get('/:lenguaje/:nivel', (req, res) => {
  const lenguaje = req.params.lenguaje;
  const nivel = req.params.nivel;
  
  const resultados = programacion.filter(curso => curso.lenguaje === lenguaje && curso.nivel === nivel);
  
  if (resultados.length === 0) {
    return res.status(404).send(`No se encontraron cursos de ${lenguaje} de nivel ${nivel}`);
  }
  res.send(resultados)
});


routerProgramacion.post('/', (req, res) => {
  let cursoNuevo = req.body

  programacion.push(cursoNuevo)
  res.send(programacion)
})

routerProgramacion.put('/:id', (req, res) => {
  const cursoActualizado = req.body
  const id = req.params.id

  const indice = programacion.findIndex(curso => curso.id == id)

  if (indice >= 0) {
    programacion[indice] = cursoActualizado
  } else {
    return res.status(404).send(programacion)
  }

  res.send(programacion)
})

routerProgramacion.patch('/:id', (req, res) => {
  const infoActualizada = req.body
  const id = req.params.id

  const indice = programacion.findIndex(curso => curso.id == id)

  if (indice >= 0) {
    const cursoModificar = programacion[indice]
    Object.assign(cursoModificar, infoActualizada)
  }

  res.send(programacion)
})

routerProgramacion.delete('/:id', (req, res) => {
  const id = req.params.id
  const indice = programacion.findIndex(curso => curso.id == id)

  if (indice >= 0) {
    programacion.splice(indice, 1)
  }

  res.send(programacion)
})


module.exports = {
  routerProgramacion
}