const STRIPE_URL = 'https://api.stripe.com/v1/';
const FORMURLENCODED = require('form-urlencoded');

class StripeClient {
  contructor(key) {
    this.key = key;
  }
  async createToken(details) {
    const keys = Object.keys(details);
    const index = this._findType(details, keys);
    var token;
    if (index === 0) {
      let type = keys[index];
      var newDetails = this._convertDetails(type, details[type]);
      token = await this._createTokenHelper(newDetails, this.key);
    } else {
      token = await this._createTokenHelper(details, this.key);
    }
    return this._parseJSON(token);
  }

  // Stripe normally only allows for fetch format for the details provided.
  // _findType allows the user to use the node format of the details by
  // figuring out which format/type the details provided are.
  _findType(details, keys) {
    if (details.card != null) {
      return keys.indexOf("card");
    } else if (details.bank_account != null) {
      return keys.indexOf("bank_account");
    } else if (details.pii != null) {
      return keys.indexOf("pii");
    } else return false;
  }

  // _convertDetails converts and returns the data in the given details
  // to the correct Stripe format for the given type.
  _convertDetails(type, details) {
    var convertedDetails = {}
    for (var data in details) {
      const string = type + '[' + data + ']';
      convertedDetails[string] = details[data];
    }
    return convertedDetails;
  }

  // Stripe gives a JSON object with the token object embedded as a JSON string.
  // _parseJSON finds that string in and returns it as a JSON object, or an error
  // if Stripe threw an error instead. If the JSON does not need to be parsed, returns the token.
  _parseJSON(token) {
    if (token._bodyInit == null) return token
    else {
      const body = JSON.parse('' + token._bodyInit);
      return body;
    }
  }

  _createTokenHelper(details, key) {
    const formBody = FORMURLENCODED(details);
    return fetch(STRIPE_URL + 'tokens', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + key
      },
      body: formBody
    });
  }
}


export default StripeClient;
