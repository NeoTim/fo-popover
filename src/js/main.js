let directives = require('./fo-popover.directives');
let services = require('./fo-popover.services');

module.exports = angular
  .module('foPopover', [
    directives.name,
    services.name
  ]);
