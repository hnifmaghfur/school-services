const joi = require('joi');

const getAll = joi.object({
  search: joi.string().allow(''),
  page: joi.string().required(),
  limit: joi.string().required(),
});

module.exports = {
  getAll
};
