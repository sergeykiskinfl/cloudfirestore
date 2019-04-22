//FirestoreUtils отвечает за вспомогательные функции
var FirestoreUtils = (function (firestoreUtils) {
 
  firestoreUtils.isInt = function(n){
    return n % 1 === 0;
}
  
  firestoreUtils.base64EncodeSafe = function(string){
    var encoded = Utilities.base64EncodeWebSafe(string);
    return encoded.replace(/=/g, "");
}

  firestoreUtils.removeTrailingSlash = function(string){
    const length = string.length;
    if (string.charAt(length - 1) === '/') {
        // Remove trailing slash
        return string.substr(0, length - 1);
    } else {
        return string;
    }
}

  firestoreUtils.getObjectFromResponse = function(response) {
    return JSON.parse(response.getContentText());
}

  firestoreUtils.checkForError = function(responseObj) {
    if (responseObj["error"]) {
        throw new Error(responseObj["error"]["message"]);
    }
}

  firestoreUtils.getIdFromPath = function(path) {
    return path.split("/").pop();
}

  firestoreUtils.addAll = function(array, itemsToAdd) {
    for (var i = 0; i < itemsToAdd.length; i++) {
        var item = itemsToAdd[i];
        array.push(item);
    }
}

   /** 
    * Создание уникального массива
    *
    * @param {Object[]} arrOrigin первоначальный массив
    * @param {string=} nameField название ключа, если массив состоит из объектов
    * @return {Object[]} массив уникальных значений
    */
   firestoreUtils.arrUniqValues = function (arrOrigin, nameField) {
        
        var arrBuffer = [];
        var objBuffer = {};

        if (nameField === undefined) {       
        
            arrOrigin.forEach(function(item){

                objBuffer[item] = true;
    
            })
    
            Object.keys(objBuffer).forEach(function(item){
    
                arrBuffer.push(item);
    
            })

            return arrBuffer;

        }
        
        arrOrigin.forEach(function(item){

            objBuffer[item[nameField]] = true;

        })

        Object.keys(objBuffer).forEach(function(item){

            arrBuffer.push(item);

        })

        return arrBuffer;

    }


 return firestoreUtils;

})(FirestoreUtils || {});