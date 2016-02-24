'use strict';

var Types = require('../Types');

module.exports = class NoArray{
  static accepts(Type){

    // Accepts Array and Generic
    if(Type instanceof Types.Array)
      return true;

    if(Type instanceof Types.Generic)
      return true;

    // Doesn't accepts all others by default
    return false;

  }
};
