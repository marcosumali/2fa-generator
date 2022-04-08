const generateError = (code, errorMessage) => {
  return {
    code,
    error: new Error(errorMessage)
  }
}


module.exports = {
  generateError
};