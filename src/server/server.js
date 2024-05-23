require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
// const InputError = require('../exceptions/InputError');

(async () => {
    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);
    const model = await loadModel();
    server.app.model = model;

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        if (response.isBoom && response.output.statusCode == 500) {
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi',
            }).code(400);
        }

        if (response.isBoom && response.output.statusCode == 413) {
            return h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            }).code(413);
        }

        return h.continue;
    });
    // server.ext('onPreResponse', postCheckFailHandler);

    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();