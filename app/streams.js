module.exports = function() {
  /**
   * available streams 
   * the id value is considered unique (provided by socket.io)
   */
  var streamList = {};

  return {
    addStream : function(id, key) {
      streamList[key] = id;
    },

    removeStream : function(key) {
      delete streamList[key]
    },

    // update function
    update : function(id, key) {
      var stream = streamList.find(function(element, i, array) {
        return element.id == id;
      });
      stream.key = key;
    },

    getStreams : function() {
      return streamList;
    }
  }
};
