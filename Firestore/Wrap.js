//FirestoreWrap отвечает за предварительную обработку объектов, считываемых и записываемых в Google Cloud Firestore
var FirestoreWrap = (function (firestoreWrap) {
  
  firestoreWrap.wrapValue = function(value) {
    var type = typeof(value);
    switch (type) {
        case "string":
            return wrapString_(value);
        case "object":
            return wrapObject_(value);
        case "number":
            return wrapNumber_(value);
        case "boolean":
            return wrapBoolean_(value);
        default:
            // error
            return null;
      }
  }
 
  firestoreWrap.unwrapValue = function(value){
    var type = Object.keys(value)[0];
    switch (type) {
        case "stringValue":
        case "booleanValue":
        case "integerValue":
        case "doubleValue":
            return value[type];
        case "nullValue":
            return null;
        case "mapValue":
            return FirestoreObj.getFieldsFromFirestoreDocument(value[type]);
        case "arrayValue":
            return unwrapArray_(value[type]["values"]);
        default:
            // error
            return null;
      }
  } 
  
  function wrapString_(string) {
    return {"stringValue": string};
  }

  function wrapObject_(object) {

    if (!object) {
        return {"nullValue": null};
     }

    if (Array.isArray(object)) {
        return wrapArray_(object);
    }

    return {"mapValue": FirestoreObj.createFirestoreDocument(object)};
  }

  function wrapNumber_(num) {
    if (FirestoreUtils.isInt(num)) {
        return wrapInt_(num);
    } else {
        return wrapDouble_(num);
    }
  }

  function wrapInt_(int) {
    return {"integerValue": int};
  }

  function wrapDouble_(double) {
    return {"doubleValue": double};
  }

  function wrapBoolean_(boolean) {
    return {"booleanValue": boolean};
  }

  function wrapArray_(array) {
    const wrappedArray = [];

    for (var i = 0; i < array.length; i++) {
        var value = array[i];
        var wrappedValue = FirestoreWrap.wrapValue(value);
        wrappedArray.push(wrappedValue);
    }

    return {"arrayValue": {"values": wrappedArray}};
}

  function unwrapArray_(wrappedArray) {
    const array = [];

    if (!wrappedArray) {
        return array;
    }

    for (var i = 0; i < wrappedArray.length; i++) {
        var wrappedValue = wrappedArray[i];
        var unwrappedValue = FirestoreWrap.unwrapValue(wrappedValue);
        array.push(unwrappedValue);
    }

    return array;
  }  
  
  return firestoreWrap;

})(FirestoreWrap || {});
