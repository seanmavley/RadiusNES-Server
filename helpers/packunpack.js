module.exports = {
  pad: function(length, padding) {

    var padding = typeof padding === 'string' && padding.length > 0 ? padding[0] : '\x00',
      length = isNaN(length) ? 0 : ~~length;

    return this.length < length ? this + Array(length - this.length + 1).join(padding) : this;

  },

  packHex: function(item) {

    var source = item.length % 2 ? item + '0' : item,
      result = '';

    for (var i = 0; i < source.length; i = i + 2) {
      result += String.fromCharCode(parseInt(source.substr(i, 2), 16));
    }

    return result;

  }

}
