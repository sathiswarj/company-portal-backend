const getHealthStatus = () => {
  return {
    status: 'OK',
    message: 'Server is running smoothly on port 5000',
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  getHealthStatus
};
