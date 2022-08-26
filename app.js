#!/usr/bin/env node

'use strict';
const blockchain = require('./blockchain');
const api = require('./api');
const faker = require('faker');
const CatboxMemory = require('@hapi/catbox-memory');
const Hapi = require('@hapi/hapi');
const fs = require('fs');
const { Client } = require('pg');
Client.poolSize = 100;

const settings = JSON.parse(fs.readFileSync(api.CONFIG_PATH, 'utf8'));
const CONTRACT_ID = process.env.NEAR_CONTRACT_ID || "dev-1659666583036-94152895119798";
const methods = new Set(["create_registry",
    "delete_registry",
    "add_device_to_registry",
    "delete_device_from_registry",
    "set_device_data",
    "get_device_data",
    "set_device_data_param",
    "get_device_data_param",
    "set_device_metadata",
    "get_device_metadata",
    "set_device_metadata_param",
    "get_device_metadata_param"]);

const init = async () => {
    const server = Hapi.server({
        port: settings.server_port,
        host: settings.server_host,
        cache: [
            {
                name: 'near-api-cache',
                provider: {
                    constructor: CatboxMemory
                }
            }
        ]
    });

    function processRequest(request) {
        Object.keys(request.payload).map((key) => {
            switch (request.payload[key]) {
                case '{username}':
                    request.payload[key] = faker.internet
                        .userName()
                        .replace(/[^0-9a-z]/gi, '');
                    break;
                case '{color}':
                    request.payload[key] = faker.internet.color();
                    break;
                case '{number}':
                    request.payload[key] = faker.random.number();
                    break;
                case '{word}':
                    request.payload[key] = faker.random.word();
                    break;
                case '{words}':
                    request.payload[key] = faker.random.words();
                    break;
                case '{image}':
                    request.payload[key] = faker.random.image();
                    break;
            }
        });

        return request;
    }

    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return api.notify(
                'Welcome to NEAR REST API SERVER (https://github.com/near-examples/near-api-rest-server)! ' +
                (!settings.master_account_id
                    ? 'Please initialize your NEAR account in order to use simple nft mint/transfer methods'
                    : `Master Account: ${settings.master_account_id}`)
            );
        },
    });

    server.route({
        method: 'POST',
        path: '/call',
        handler: async (request, res) => {
            request = processRequest(request);
            let {
                account_id,
                method,
                params,
                network,
                rpc_node,
                headers
            } = request.payload;
            let private_key = request.headers.authorization.replace('Bearer ', "");

            if (!methods.has(method)) {
                return res.response({
                    error: "Not method in ConnectIoT contract"
                }).code(404);
            }

            if (method === "set_device_data") {
                params["data"] = JSON.stringify(params["data"], (k, v) => v && typeof v === 'object' ? v : '' + v)
            }

            if (method === "set_device_metadata") {
                params["metadata"] = JSON.stringify(params["metadata"], (k, v) => v && typeof v === 'object' ? v : '' + v)
            }

            const call_resp = await blockchain.Call(
                account_id,
                private_key,
                CONTRACT_ID,
                method,
                params,
                network,
                rpc_node,
                headers
            );
            if (!(call_resp.status && call_resp.status.SuccessValue)) {
                return res.response({
                    message: "Error in contract call"
                }).code(500);
            }

            let resp;
            const data = JSON.parse(Buffer.from(call_resp.status.SuccessValue, 'base64').toString());
            if (method === "get_device_data" || method === "get_device_metadata") {
                resp = {};
                data.forEach(pair => {
                    resp[pair[0]] = pair[1];
                });
            } else {
                resp = {
                    data,
                };
            }

            return res.response(resp).code(200);
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
