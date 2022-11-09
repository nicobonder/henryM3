'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise (executor){
    if(typeof executor !== 'function')
    throw new TypeError('executor is not a function')
    this._state = 'pending';
    this._handlerGroups = []; //tiene q ser un arreglo porque puedo tener varios then. _handlerGroups es una nueva prop de las promises
    executor(this._internalResolve.bind(this), this. _internalReject.bind(this)) //.bind*this se usa para que el this sea lo que en ese momento es el this, asi me aseguro que en el constructor el this esta apuntando a la instancia del objeto. Esto se puede resolver con una arrow function
}

$Promise.prototype._internalResolve = function(data){
    if(this._state === 'pending'){
        this._state = 'fulfilled'
        this._value = data;
        this._callHandlers(); //quiero q cdo se resuelva la promesa ademas de cambiar el state y pasar data, llame al handler
    }
}
$Promise.prototype._internalReject = function(reason){
    if(this._state === 'pending'){
        this._state = 'rejected'
        this._value = reason
        this._callHandlers() //quiero q cdo se resuelva la promesa ademas de cambiar el state y pasar data, llame al handler
    }
}

//el then los pushea pero no ejecuta los handlers, entonces necesito una funcion q los ejecute.
//Puedo tener muchos handlers, asi q tengo que ver como ejecutar cada uno.
//saco el primer handler con un shift
$Promise.prototype._callHandlers = function(){
    while(this._handlerGroups.length){
        const hd = this._handlerGroups.shift();
        if(this._state = 'fulfilled'){
            if(hd.successCb){//para verificar que la cb sea una func, porq en el handlerGroup tb podiamos tener false
                hd.successCb(this._value); //ahora si lo ejecuto y le paso el valor de la promesa
            }//tengo que chequear si esta completo, para eso reviso el state
        }  else if(this._state === 'rejected'){ //si no esta completo, chapter 3
            if(hd.errorCb){
                hd.errorCb(this._value);
            }
        }
    }
}

$Promise.prototype.then = function(successCb, errorCb){
    if( typeof successCb !== 'function') successCb = false
    if( typeof errorCb !== 'function') errorCb = false

    this._handlerGroups.push({ //es un objeto xq tiene 2 props successCb y errorCb, que los recibo como parameto
        successCb, //estoy pusheando funciones dentro de handlerGroups
        errorCb
    }) 
    if(this._state !== 'pending'){
        this._callHandlers()
    } //en los internal ejecutaba los handlers cdo el state es pending, ahora lo ejecuto cdo esta en otro state y alguien invoca el then
}

$Promise.prototype.catch = function(){}

//const promise = new $Promise(executor);

/*this._internalResolve = function(){
        this._state = 'fulfilled'
    }
    this._internalReject = function(){}
    */


module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
