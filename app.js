var m = require('mithril')
var text = require('./text')
var aggsy = require('aggsy')

var testQuery = 'model(distance: _sum(km), reports: _count())'

var testData = `[
  { "model": "volvo", "make": "v50", "km": 100 },
  { "model": "tesla", "make": "s", "km": 200 },
  { "model": "tesla", "make": "s", "km": 120 },
  { "model": "tesla", "make": "x", "km": 10 }
]`

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
      m('div#header', [m('span[style=color: #5D90CD]', 'Aggsy'), m('span[style=color: grey]', 'Play')]),
      m('div#querycontainer', [
        m('input#query[type=text]', { value: ctrl.query(), onkeyup: m.withAttr('value', ctrl.updateQuery), placeholder: 'query', class: ctrl.error() ? 'invalid' : '' }),
        m('label#querylabel[for=query]', 'query')
      ]),
      m('div#data', m.component(text, { update: ctrl.updateData, value: ctrl.data })),
      m('div#result', m.component(text, { value: ctrl.result, readOnly: true }))
    ]
  }
}

module.exports = App
