//FirestoreAuth отвечает за аутентификацию на серверах Google
var FirestoreAuth = (function (firestoreAuth) {

// Auth token is formatted according to:
// https://developers.google.com/identity/protocols/OAuth2ServiceAccount#authorizingrequests

firestoreAuth.getAuthToken = function (email, key) {
    const jwt = createJwt_(email, key);

    var options = {
        'method': 'post',
        'payload': 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt,
        'muteHttpExceptions': true
    };

    const response = UrlFetchApp.fetch("https://www.googleapis.com/oauth2/v4/token/", options);
    const responseObj = JSON.parse(response.getContentText());

    return responseObj["access_token"];
}

function createJwt_(email, key) {

    const jwtHeader = {"alg": "RS256", "typ": "JWT"};

    const now = new Date();
    const nowSeconds = now.getTime() / 1000;

    now.setHours(now.getHours() + 1);
    const oneHourFromNowSeconds = now.getTime() / 1000;

    const jwtClaim = {
        "iss": email,
        "scope": "https://www.googleapis.com/auth/datastore",
        "aud": "https://www.googleapis.com/oauth2/v4/token/",
        "exp": oneHourFromNowSeconds,
        "iat": nowSeconds
    };

    const jwtHeaderBase64 = FirestoreUtils.base64EncodeSafe(JSON.stringify(jwtHeader));
    const jwtClaimBase64 = FirestoreUtils.base64EncodeSafe(JSON.stringify(jwtClaim));

    const signatureInput = jwtHeaderBase64 + "." + jwtClaimBase64;

    const signature = Utilities.computeRsaSha256Signature(signatureInput, key);
    const encodedSignature = FirestoreUtils.base64EncodeSafe(signature);

    const jwt = signatureInput + "." + encodedSignature;

    return jwt;
}

  return firestoreAuth;

})(FirestoreAuth || {});