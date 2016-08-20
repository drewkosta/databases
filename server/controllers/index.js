var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(req, res);
    },
    post: function (req, res) {
      models.messages.post(req, res);
    }
  },

  users: {
    get: function (req, res) {
      models.users.get(req, res);
    },
    post: function (req, res) {
      models.users.post(req, res);
    }
  }
};

