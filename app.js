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
    var error = m.prop('')

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
      error('')
      try {
        var res = aggsy(query().trim(), JSON.parse(data()))
        result(JSON.stringify(res, null, '\t'))
      } catch (e) {
        error(' faulty query')
      }
    }
  },
  view: function (ctrl) {
    return [
      m('input[type=text][style=width:300px]', { value: ctrl.query(), onkeyup: m.withAttr('value', ctrl.updateQuery), placeholder: 'query' }),
      m('span[style=color:red]', ctrl.error()),
      m('div[style=position:absolute;top:10%;bottom:45%;right:0;left:0]', m.component(text, { update: ctrl.updateData, value: ctrl.data })),
      m('div[style=position:absolute;top:55%;bottom:0;right:0;left:0]', m.component(text, { value: ctrl.result, readOnly: true }))
    ]
  }
}

module.exports = App
