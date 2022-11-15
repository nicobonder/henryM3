function sumArray(array, num){
    for(let i = 0; i < array.length; i++){
        for(let j = i+1; j < array.length; j++){
            if(array[i] + array[j] === num){
                return true
            }
        }
    } 
    return false
}

module.exports = {
    sumArray
} 