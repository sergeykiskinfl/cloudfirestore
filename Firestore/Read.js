//FirestoreRead отвечает за считывание из Google Cloud Firestore

var FirestoreRead = (function (firestoreRead) {

/**
 * Get the Firestore document or collection at a given path. If the collection
 *  contains enough IDs to return a paginated result, this method only
 *  returns the first page.
 *
 * @param {string} path the path to the document or collection to get
 * @param {string} email the user email address (for authentication)
 * @param {string} key the user private key (for authentication)
 * @param {string} projectId the Firestore project ID
 * @return {object} the JSON response from the GET request
 */

 firestoreRead.get = function (path, email, key, projectId) {
    return getPage_(path, email, key, projectId);
}

/**
 * Get a page of results from the given path. If null pageToken
 *  is supplied, returns first page.
 */
function getPage_(path, email, key, projectId, pageToken) {
    const token = FirestoreAuth.getAuthToken(email, key);

    var baseUrl = "https://firestore.googleapis.com/v1beta1/projects/" + projectId + "/databases/(default)/documents/" + path;
    const options = {
        'muteHttpExceptions': true,
        'headers': {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    };

    if (pageToken) {
        baseUrl += "?pageToken=" + pageToken;
        options['pageToken'] = pageToken;
    }

    var responseObj = FirestoreUtils.getObjectFromResponse(UrlFetchApp.fetch(baseUrl, options));
    FirestoreUtils.checkForError(responseObj);

    return responseObj;
}

/**
 * Get fields from a document.
 *
 * @param {string} path the path to the document
 * @param {string} email the user email address (for authentication)
 * @param {string} key the user private key (for authentication)
 * @param {string} projectId the Firestore project ID
 * @return {object} an object mapping the document's fields to their values
 */
firestoreRead.getDocumentFields = function (path, email, key, projectId) {
    const doc = FirestoreRead.get(path, email, key, projectId);

    if (!doc["fields"]) {
        throw new Error("No document with `fields` found at path " + path);
    }

    return FirestoreObj.getFieldsFromFirestoreDocument(doc);
}

/**
 * Get fields from a document without error handling.
 *
 * @param {string} path the path to the document
 * @param {string} email the user email address (for authentication)
 * @param {string} key the user private key (for authentication)
 * @param {string} projectId the Firestore project ID
 * @return {object} an object mapping the document's fields to their values
 */
firestoreRead.getDocumentSnapshot = function (path, email, key, projectId) {
    
    var doc = FirestoreRead.get(path, email, key, projectId);

    if (!doc["fields"]) {
        
        var doc = {};  
    
        return doc;
    }

    return FirestoreObj.getFieldsFromFirestoreDocument(doc);
}

/**
 * Get fields from a document.
 *
 * @param {string} path the path to the document
 * @param {string} email the user email address (for authentication)
 * @param {string} key the user private key (for authentication)
 * @param {string} projectId the Firestore project ID
 * @return {object} an object mapping the document's fields to their values
 */
firestoreRead.getWrapValue = function (path, email, key, projectId) {
    
    const doc = FirestoreRead.get(path, email, key, projectId);
    
    return FirestoreObj.getFieldsFromFirestoreDocument(doc);
    }

  return firestoreRead;

})(FirestoreRead || {});