'use strict';

var Types = require('../Types');

module.exports = class Primitive{
  static accepts(Type){

    // Doesn't accepts Array and Object
    if(Type instanceof Types.Array)
      return false;

    if(Type instanceof Types.Object)
      return false;

    // Accepts all others by default
    return true;

  }
};
