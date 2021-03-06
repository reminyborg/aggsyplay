var m = require('mithril')
var ace = require('brace')
require('brace/theme/clouds')
require('brace/mode/json')

var Text = {
  config: function (options) {
    return function (element, isInitialized, context) {
      if (!isInitialized) {
        var editor = context.editor = ace.edit(element)
        var session = editor.getSession()
        session.setMode('ace/mode/json')
        session.setTabSize(2)
        session.setUseSoftTabs(true)
        editor.setTheme('ace/theme/clouds')
        editor.setShowPrintMargin(false)
        editor.renderer.setShowGutter(false)
        editor.$blockScrolling = Infinity

        editor.on('focus', function () {
          context.editor.container.parentElement.parentElement.firstChild.classList.add('active')
        })
        editor.on('blur', function () {
          context.editor.container.parentElement.parentElement.firstChild.classList.remove('active')
        })

        if (options.readOnly) {
          editor.setReadOnly(true)
        }

        if (options.update) {
          editor.on('change', function () {
            options.update(editor.getValue())
            m.redraw()
          })
        }
      }

      if (options.value && context.editor.getValue() !== options.value()) {
        context.editor.setValue(options.value(), -1)
      }
    }
  },
  controller: function (options) {
    options = options || {}
    this.update = options.update
    this.value = options.value
    this.readOnly = options.readOnly
  },
  view: function (ctrl) {
    return m('', { config: Text.config(ctrl), style: 'position: absolute; top:0px;left:0;right:0;bottom:0;' })// ,
  }
}

module.exports = Text
