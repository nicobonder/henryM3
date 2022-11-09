/*********** Yo explico `exerciseUtils` ********
*
* excersiceUtils es una variable que viene de un archivo en este repo
* El archivo `./utils` esta en este nivel y se llama `utils.js`
*
* Este archivo crea un `promisifiedReadFile` - FIJATE EN ÉL!!!
*
* Las funciones `blue` y `magenta` para mantener tu código DRY
*
***********************************************/

'use strict';

var Promise = require('bluebird'),
    exerciseUtils = require('./utils');

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
  problemE: problemE,
  problemF: problemF
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. loguea el poema uno stanza uno (ignorá errores)
   *
   */

  // callback version
  // readFile('poem-one/stanza-01.txt', function (err, stanza) {
  //   console.log('-- A. callback version --');
  //   blue(stanza);
  // });

  // promise version
  //En lugar de response pone stanza, y en lugar de console.log usa blue
  promisifiedReadFile('poem-one/stanza-01.txt')
  .then((stanza) => blue(stanza))
}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. loggea el poema uno stanza dos y tres, en cualquier orden
   *    (ignora errores)
   *
   */

  // callback version
  // readFile('poem-one/stanza-02.txt', function (err, stanza2) {
  //   console.log('-- B. callback version (stanza two) --');
  //   blue(stanza2);
  // });
  // readFile('poem-one/stanza-03.txt', function (err, stanza3) {
  //   console.log('-- B. callback version (stanza three) --');
  //   blue(stanza3);
  // });

  // promise version
  // ???
  promisifiedReadFile('poem-one/stanza-02.txt').then((stanza) => blue(stanza))
  promisifiedReadFile('poem-one/stanza-03.txt').then((stanza) => blue(stanza))

}

function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. lee & loggea el poema uno stanza dos y *DESPUES* lee & loggea
   *    stanza tres. Loggea 'done' cuando ambas hayan terminado. Fijate
   *    que los specs estan opinionados y espera la palabra exacta
   *    'done' (case sensitive) para ser loggeada para poder pasar
   *    (ignora errores)
   *
   */

  // callback version
  // readFile('poem-one/stanza-02.txt', function (err, stanza2) {
  //   console.log('-- C. callback version (stanza two) --');
  //   blue(stanza2);
  //   readFile('poem-one/stanza-03.txt', function (err, stanza3) {
  //     console.log('-- C. callback version (stanza three) --');
  //     blue(stanza3);
  //     console.log('-- C. callback version done --');
  //   });
  // });

  // promise version (hint: don't need to nest `then` calls)
  // ???
  /***SOLUCION VALIDA PERO NO RECOMENDABLE */
  // promisifiedReadFile('poem-one/stanza-02.txt').then((stanza2) => {
  //   blue(stanza2);
  //   promisifiedReadFile('poem-one/stanza-03.txt').then((stanza3) => {
  //     blue(stanza3);
  //     console.log('done');
  // });
  // })

  /***SOLUCION RECOMENDADA */
  //como tenemos varias promesas, trabajo con array de promesas. 
  //Usamos el metodo all
  // Promise.all([
  //   promisifiedReadFile('poem-one/stanza-02.txt'),
  //   promisifiedReadFile('poem-one/stanza-03.txt'),
  // ]).then((stanzas) => {
  //   blue(stanzas[0]);
  //   blue(stanzas[1]);
  //   console.log('done');
  // })

  /****VERSION MEJORADA */
  // Promise.all([
  //   promisifiedReadFile('poem-one/stanza-02.txt'),
  //   promisifiedReadFile('poem-one/stanza-03.txt'),
  // ]).then((stanzas) => {
  //   stanzas.forEach((stanza) => blue(stanza));
  //   console.log('done');
  // })

  /****OTRA VERSION MAS */
  promisifiedReadFile('poem-one/stanza-02.txt') //tiene un manejador .then
    .then((stanza2) => { //el handler recibe stanza2, o sea es como que arriba imrpime stanza2 y lo manda
      blue(stanza2); 
      return promisifiedReadFile('poem-one/stanza-03.txt'); //el return sirve para encadenar los them, para eso returna la promesa q sigue
    })
    .then((stanza3) =>{ //este then maneja lo que viene de arriba
      blue(stanza3);
      console.log('done');
    });

}

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. loggea el poema uno stanza cuatro o un error si llega a ocurrir
   *
   */

  // callback version
  // readFile('poem-one/wrong-file-name.txt', function (err, stanza4) {
  //   console.log('-- D. callback version (stanza four) --');
  //   if (err) magenta(new Error(err));
  //   else blue(stanza4);
  // });

  // promise version
  // ???
  // promisifiedReadFile('poem-one/stanza-04.txt')
  // .then(
  //   (stanza) => blue(stanza), //success handler
  //   (err) => magenta(err) //error handler
  //   )

  /***version correcta */
    promisifiedReadFile('poem-one/wrong-file-name.txt')
  .then(
    (stanza) => blue(stanza), //success handler
    (err) => magenta( new Error(err)) //error handler
    //puede ser con catch(err) => magenta( new Error(err))
    )

}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. Lee y loggea el poema uno stanza tres y *DESPUES* lee y loggea la
   *    stanza cuatro o loggea un error si llegase a ocurrir para
   *    cuaquiera de las lecturas
   *
   */

  // callback version
  // readFile('poem-one/stanza-03.txt', function (err, stanza3) {
  //   console.log('-- E. callback version (stanza three) --');
  //   if (err) return magenta(new Error(err));
  //   blue(stanza3);
  //   readFile('poem-one/wrong-file-name.txt', function (err2, stanza4) {
  //     console.log('-- E. callback version (stanza four) --');
  //     if (err2) return magenta(new Error(err2));
  //     blue(stanza4);
  //   });
  // });
  
  // promise version
  // ???
  promisifiedReadFile('poem-one/stanza-03.txt')
  .then((stanza3) => {
    blue(stanza3);
    return promisifiedReadFile('poem-one/wrong-file-name.txt');
  })
  .then((stanza4) => {blue(stanza4);
  })
  .catch((err) => magenta(new Error(err))); //el catch toma el error de cualquier promesa de las q esta arriba
    
  
}

function problemF () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * F. Lee & loggea el poema uno stanza tres y *DESPUES* lee y loguea la
   *    stanza cuatro o loggea un error si occrre para cualquiera de las
   *    lecturas y siempre loggea 'done' cuando todo haya terminado
   *
   */

  // callback version
  // readFile('poem-one/stanza-03.txt', function (err, stanza3) {
  //   console.log('-- F. callback version (stanza three) --');
  //   if (err) {
  //     magenta(new Error(err));
  //     console.log('-- F. callback version done --');
  //     return;
  //   }
  //   blue(stanza3);
  //   readFile('poem-one/wrong-file-name.txt', function (err2, stanza4) {
  //     console.log('-- F. callback version (stanza four) --');
  //     if (err2) magenta(new Error(err2));
  //     else blue(stanza4);
  //     console.log('-- F. callback version done --');
  //   });
  // });


  promisifiedReadFile('poem-one/stanza-03.txt')
  .then((stanza3) => {
    blue(stanza3);
    return promisifiedReadFile('poem-one/wrong-file-name.txt');
  })
  .then((stanza4) => {
    blue(stanza4);
    console.log('done');
  })
  .catch((err) => {
    magenta(new Error(err))
    console.log('done');
  }); //el catch toma el error de cualquier promesa de las q esta arriba
    


}
/*promisifiedReadFile('poem-one/stanza-03.txt').then((stanza) => blue(stanza),
  promisifiedReadFile('poem-one/stanza-04.txt').then(
    (stanza) => blue(stanza),
    (err) => magenta(err)
    )
  )*/