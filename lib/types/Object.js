'use strict';

var Types = require('../Types');

module.exports = class NoObject{
  static accepts(Type){

    // Accepts Array and Generic
    if(Type instanceof Types.NoObject)
      return true;

    if(Type instanceof Types.Generic)
      return true;

    // Doesn't accepts all others by default
    return false;

  }
};
