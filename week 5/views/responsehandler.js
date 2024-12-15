function successResponse(res, statusCode, data, message) {
    res.status(statusCode).json({ statusCode, data, message });
}

function errorResponse(res, statusCode, message) {
    res.status(statusCode).json({ statusCode, message });
}

module.exports = {
    successResponse,
    errorResponse
};
