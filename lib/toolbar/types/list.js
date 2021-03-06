var $ = require('tinyselector');
var Button = require('./button.js');

require('./list.less');

function ListButton(options) {
  Button.apply(this, arguments);
  
  var dropdown = this._dropdown = $('<ul/>').ac('ff-toolbar-list-dropdown').html('dropdown');
  $(this.dom()).ac('ff-toolbar-list-btn').append(dropdown);
  
  options && options.items && this.items(options.items);
}

var proto = ListButton.prototype = Object.create(Button.prototype);

proto.dropdown = function() {
  return this._dropdown[0];
};

proto.handleEvent = function(e) {
  if( e.type == 'click' && !this.dropdown().contains(e.target) ) this.toggleList();
  Button.prototype.handleEvent.call(this, e);
};

proto.enable = function(b) {
  var result = Button.prototype.enable.apply(this, arguments);
  
  if( !arguments.length ) return result;
  
  if( !b ) $(this.dropdown()).rc('open');
  return this;
},

proto.toggleList = function() {
  var el = $(this.dropdown());
  $('.ff-toolbar-list-dropdown').rc('open');
  if( !this.enable() ) el.rc('open');
  else el.tc('open');
  return this;
};

proto.text = function(txt) {
  this._el.html(txt).append(this.dropdown());
  return this;
};

proto.select = function(item) {
  $('.ff-toolbar-list-dropdown').rc('open');
  var items = this.items();
  var index = items.indexOf(item);
  var o = this.options();
  var fn = o.onselect;
  fn && fn.call(this.scope(), item, index, this);
  return this;
};

proto.items = function(items) {
  if( !arguments.length ) return this._items;
  if( !items ) items = [];
  if( typeof items == 'function' ) items = items.call(this.scope(), this);
  
  var self = this;
  var dropdown = $(this.dropdown()).empty()[0];
  this._items = $.each(items, function(i, item) {
    var html = (typeof item == 'string' ? item : item.text) || item;
    $('<li/>').html(html).appendTo(dropdown).on('click', function(e) {
      self.select(item);
    });
  });
  
  return this;
};

$(document).ready(function() {
  $(document.body).on('click', function() {
    $('.ff-toolbar-list-dropdown').rc('open');
  });
});


module.exports = ListButton;