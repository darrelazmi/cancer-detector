require('dotenv').config()

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes.js');
const loadModel = require('../services/loadModel.js')
const InputError = require('../exception/InputError.js')

const mulai = async () => {

    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    const model = await loadModel();
    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;

        // Jika salah input
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        // Jika server error or lebih dari 1MB
        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        // Kalau gak ada error
        return h.continue;
    });

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
}

mulai();