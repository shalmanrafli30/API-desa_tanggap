const logsRequest = (req, res, next) => {
    console.log('Log request', req.path);
    next();
}

module.exports = logsRequest;