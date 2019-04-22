//FirestoreWrite отвечает за перенос данных в Google Cloud Firestore

var FirestoreWrite = (function (firestoreWrite) {
  
  /**
 * Create a document with the given ID and fields.
 *
 * @param {string} path the path where the document will be written
 * @param {string} documentId the document's ID in Firestore
 * @param {object} fields the document's fields
 * @param {string} email the user email address (for authentication)
 * @param {string} key the user private key (for authentication)
 * @param {string} projectId the Firestore project ID
 * @return {object} the Document object written to Firestore
 */
  firestoreWrite.createDocumentWithId = function (path, documentId, fields, email, key, projectId) {
    const token = FirestoreAuth.getAuthToken(email, key);

    const firestoreObject = FirestoreObj.createFirestoreDocument(fields);

    const pathWithNoTrailingSlash = FirestoreUtils.removeTrailingSlash(path);
    var baseUrl = "https://firestore.googleapis.com/v1beta1/projects/" + projectId + "/databases/(default)/documents/" + pathWithNoTrailingSlash; //Нужно вынести в Settings
    if (documentId) {
        baseUrl += "?documentId=" + documentId;
    }

    const options = {
        'method': 'post',
        'muteHttpExceptions': true,
        'payload': JSON.stringify(firestoreObject),
        'headers': {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    };

    const response = UrlFetchApp.fetch(baseUrl, options);
    const responseObj = FirestoreUtils.getObjectFromResponse(response);

    FirestoreUtils.checkForError(responseObj);

    return responseObj;
  }

/**
 * Update/patch a document at the given path with new fields.
 *
 * @param {string} path the path of the document to update
 * @param {object} fields the document's new fields
 * @param {string} email the user email address (for authentication)
 * @param {string} key the user private key (for authentication)
 * @param {string} projectId the Firestore project ID
 * @return {object} the Document object written to Firestore
 */
  firestoreWrite.updateDocument = function (path, fields, email, key, projectId) {
    const token = FirestoreAuth.getAuthToken(email, key);

    const firestoreObject = FirestoreObj.createFirestoreDocument(fields);

    const baseUrl = "https://firestore.googleapis.com/v1beta1/projects/" + projectId + "/databases/(default)/documents/" + path; //Нужно вынести в Settings
    const options = {
        'method': 'patch',
        'muteHttpExceptions': true,
        'payload': JSON.stringify(firestoreObject),
        'headers': {'content-type': 'application/json', 'Authorization': 'Bearer ' + token}
    };

    const response = UrlFetchApp.fetch(baseUrl, options);
    const responseObj = FirestoreUtils.getObjectFromResponse(response);
     FirestoreUtils.checkForError(responseObj);

    return responseObj;
  }
 
   return firestoreWrite;

})(FirestoreWrite || {});