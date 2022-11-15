function pluckArray(array, prop){
    //puedo iterar dentro del objeto
    // y hacer push de los valores de la prop a en la pluckArray
    
    return array.map(e =>e[prop])

}

module.exports = {pluckArray};