const predictClassification = require('../services/inferenceService.js')
const crypto = require('crypto');
const storeData = require('../services/storeData.js');
const getData = require('../services/getData.js');

async function postPredictHandler(request, h) {
    
    const { image } = request.payload;
    const { model } = request.server.app;
    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": label,
        "suggestion": suggestion,
        "createdAt": createdAt
    };

    await storeData(id, data);

    const response = h.response({
        status: "success",
        message: "Model is predicted successfully",
        data
    });

    response.code(201);

    return response;
}

async function getStoredHandler(request, h) {
    const history = await getData();

    const response = h.response({
        status: 'success',
        data: history
    })
    response.code(200);
    return response;
}

module.exports = {postPredictHandler, getStoredHandler};