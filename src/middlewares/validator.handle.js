function validatorHandler(schema, property) {
    return (req, res, next) => {
      const data = req[property];
      const { error, value } = schema.validate(data, { abortEarly: false, convert: true });
      if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
      }
      if (value && property === 'params') {
        req[property] = value;
      }
      next();
    };
  }
  module.exports = validatorHandler;