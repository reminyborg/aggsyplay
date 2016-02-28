var m = require('mithril')
var domready = require('domready')

domready(function () {
  m.mount(document.getElementById('app'), require('./app.js'))
})
