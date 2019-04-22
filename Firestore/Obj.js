//FirestoreObj отвечает за создание объектов, которые можно записывать и считывать из Google Cloud Firestore
var FirestoreObj = (function (firestoreObj) {

/**
 * Create a Firestore documents with the corresponding fields.
 *
 * @param {object} fields the document's fields
 * @return {object} a Firestore document with the given fields
 */
firestoreObj.createFirestoreDocument = function (fields) {
    const keys = Object.keys(fields);
    const cloudFirestoreObj = {};

    cloudFirestoreObj["fields"] = {};

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = fields[key];

        cloudFirestoreObj["fields"][key] = FirestoreWrap.wrapValue(val);
    }

    return cloudFirestoreObj;
}

/**
 * Extract fields from a Firestore document.
 *
 * @param {object} firestoreDoc the Firestore document whose fields will be extracted
 * @return {object} an object with the given document's fields and values
 */
firestoreObj.getFieldsFromFirestoreDocument = function (firestoreDoc) {
    if (!firestoreDoc || !firestoreDoc["fields"]) {
        return {};
    }

    const fields = firestoreDoc["fields"];
    const keys = Object.keys(fields);
    const object = {};

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var firestoreValue = fields[key];

        object[key] = FirestoreWrap.unwrapValue(firestoreValue);
    }

    return object;
}
 
  return firestoreObj;

})(FirestoreObj || {});
