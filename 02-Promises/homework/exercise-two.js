'use strict';

const { reject } = require('bluebird');
var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');
const { resolve } = require('path');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    blue = exerciseUtils.blue,
    magenta = exerciseUtils.magenta;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loggea el poema dos stanza uno y stanza dos en cualquier orden
   *    pero loggea 'done' cuando ambos hayan terminado
   *    (ignora errores)
   *    nota: lecturas ocurriendo paralelamente (en simultaneo)
   *
   */

  // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  // promise version
  // ???
  Promise.all([
    promisifiedReadFile('poem-two/stanza-01.txt'),
    promisifiedReadFile('poem-two/stanza-02.txt')
  ])
  .then((stanzas) =>{ //stanzas es un array de respuestas, q serian los valores a las q se resolvieron las promesas de arriba
    stanzas.forEach((stanza) => blue(stanza))
    console.log('done');
  })
}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea todas las stanzas en poema dos, en cualquier orden y loggea
   *    'done' cuando todas hayan terminado
   *    (ignora errores)
   *    nota: las lecturas ocurren en paralelo (en simultaneo)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  }); 

  // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  // promise version
  // ??? 
  /***COMO ARMAMOS UNA ARRAY DE PROMESAS */
  //hace una map de la array filenames, y p/ c/ elem lee promisificado el elem
  const promises = filenames.map((file) => promisifiedReadFile(file));

  //ya tengo una array de promesas, ahora se lo paso a Promise.all
  Promise.all(promises)
    .then((stanzas) =>{//recibe array de respuestas
      stanzas.forEach((stanza) => blue(stanza));
      console.log('done');
    })
}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. Lee y loggea todas las stanzas en el poema dos, *en orden* y
   *    loggea 'done cuando hayan terminado todas
   *    (ignorá errores)
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );

  // promise version
  // ???
  const promises = filenames.map((file) => promisifiedReadFile(file));
  filenames.reduce((promise, file, index) => {
    return promise.then ((stanza) => { //retorna la promesa q sigue
      if (stanza) blue(stanza); //si existe una promesa +
      return promisifiedReadFile(file) //ahi retorna esto
    });
  },
  Promise.resolve(false))
  .then((stanza) => {
    blue(stanza);
    console.log('done');
  });
}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea todas las stanzas en el poema dos *en orden* asegurandote
   *    de fallar para cualquier error y logueando un 'done cuando todas
   *    hayan terminado
   *    nota: las lecturas ocurren en serie (solo cuando las previas
   *    hayan terminado)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       blue(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) magenta(new Error(err));
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // promise version
  // ???

  const promises = filenames.map((file) => promisifiedReadFile(file));
  Promise.all(promises)
  .then((stanzas) =>{//recibe array de respuestas
    stanzas.forEach((stanza) => blue(stanza));
    console.log('done');
  })
  .catch((err) => {//no necesito array de errores, cdo encuentra uno lo imprime y listo
    magenta(new Error (err));
    console.log('done');
  });
}

function problemE () {///*****NO TIENE TEST */
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Haz una versión promisificada de fs.writeFile
   *
   */

  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    // tu código aquí
    //al metododo writeFile le tengo que pasar todos sos parametrs
    return new Promise((resolve, reject) => {
      fs.writeFile(filename, str, 'utf-8', (e) =>{
        if(err) throw reject(err);
        resolve(); //no necesito pasarle ningun valor a la resolucion
      });
    })
  } 
}
