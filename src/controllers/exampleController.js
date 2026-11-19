const exampleService = require('../services/exampleService');

const getHealth = (req, res) => {
  try {
    const data = exampleService.getHealthStatus();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getHealth
};
