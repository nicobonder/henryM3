const express = require('express');
const app = express();
const { sumArray } = require('./utils.js')
const { pluckArray } = require('./pluckutil')

app.use(express.json()); // for parsing application/json

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'hola',
  });
});

app.get('/test', (req, res) => {
  res.status(200).send({
    message: 'test',
  });
});

app.post('/sum', (req, res) =>{
  res.status(200).send({
    result: req.body.a + req.body.b
  })
})

app.post('/product', (req, res) => {
  res.status(200).send({
    result: req.body.a * req.body.b,
  });
});

app.post('/sumArray', (req, res) => {
  const { array, num } = req.body;
  const result = sumArray(array, num);
  res.json({result});
});

app.get('/numString', (req,res) => {
 const { q } = req.query;
 if(!q || !isNaN(Number(q)) ){
  return res.sendStatus(400)
 }
  res.send({
    result: q.length
  })
})

app.post('/pluck', (req,res) =>{
  res.sendStatus(200)
  const { array, prop } = req.body;
  const result = pluckArray(array, prop);
  res.json({result})
})

module.exports = app; // Exportamos app para que supertest session la pueda ejecutar
