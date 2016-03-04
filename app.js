var m = require('mithril')
var text = require('./text')
var aggsy = require('aggsy')
var version = require('aggsy/package.json').version

var testQuery = 'model(distance: _sum(km), reports: _count())'

var testData = `[
  { "model": "volvo", "make": "v50", "km": 100 },
  { "model": "tesla", "make": "s", "km": 200 },
  { "model": "tesla", "make": "s", "km": 120 },
  { "model": "tesla", "make": "x", "km": 10 }
]`

var reducers = [
  { name: '_sum' },
  { name: '_count' },
  { name: '_min' },
  { name: '_max' },
  { name: '_first' },
  { name: '_last' },
  { name: '_has' },
  { name: '_avg' },
  { name: '_stdev' }
]

var App = {
  controller: function () {
    var query = m.prop(testQuery)
    var data = m.prop(testData)
    var result = m.prop('')
    var error = m.prop(false)

    return {
      query: query,
      updateQuery,
      data: data,
      updateData: updateData,
      result: result,
      error: error
    }

    function updateQuery (string) {
      query(string)
      update()
    }

    function updateData (string) {
      data(string)
      update()
    }

    function update () {
      error(false)
      try {
        var res = aggsy(query().trim(), JSON.parse(data()))
        result(JSON.stringify(res, null, '\t'))
      } catch (e) {
        error(true)
      }
    }
  },
  view: function (ctrl) {
    return [
      m('#header', [
        m('span[style=color:#5D90CD;font-size:23px]', 'Aggsy'),
        m('span[style=color:grey;font-size:23px]', 'Play'),
        m('a[href=https://github.com/reminyborg/aggsy][style=float:right;margin-right: 12px;color:grey]', 'github'),
        m('span.version', 'aggsy v' + version)
      ])
    ].concat(reducers.map(function (reducer) {
      return m('#reducer', [reducer.name + ' ', reducer.description ? m('img[src=info.svg][style=width:14px;vertical-align:middle]', { title: reducer.description }) : ''])
    }), m('#content', [
      m('#query-container', [
        m('input#query[type=text]', { value: ctrl.query(), onkeyup: m.withAttr('value', ctrl.updateQuery), placeholder: 'query', class: ctrl.error() ? 'invalid' : '' }),
        m('label#querylabel[for=query]', 'query')
      ]),
      m('.container#data', [
        m('.label', 'data'),
        m('.text', m.component(text, { update: ctrl.updateData, value: ctrl.data }))
      ]),
      m('.container#result', [
        m('.label', 'result'),
        m('.text', m.component(text, { value: ctrl.result, readOnly: true }))
      ])
    ]))
  }
}

module.exports = App
