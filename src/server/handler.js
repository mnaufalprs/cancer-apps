const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const { v4: uuidv4 } = require('uuid');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    // const { result, suggestion } = await predictClassification(model, image);
    const [result] = await predictClassification(model, image);
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const data = {
        "id": id,
        "result": result > 0.5 ? 'Cancer' : 'Non-cancer',
        "suggestion": result > 0.5 ? 'Segera periksa ke dokter!!!' : 'Bagus terus jaga kesehatan anda',
        "createdAt": createdAt
    }

    await storeData(id, data);

    return h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    }).code(201);
}
module.exports = postPredictHandler;