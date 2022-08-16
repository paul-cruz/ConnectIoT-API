const nearApi = require('near-api-js');
const api = require('./api');
const fs = require('fs');

const settings = JSON.parse(fs.readFileSync(api.CONFIG_PATH, 'utf8'));

module.exports = {
    Call: async function (account_id, private_key, recipient, method, params, network, rpc_node, headers) {
        try {
            const account = await this.GetAccountByKey(account_id, private_key, network, rpc_node, headers);

            return await account.functionCall({
                contractId: recipient,
                methodName: method,
                args: params,
            });
        } catch (e) {
            return api.reject(e);
        }
    },

    GetAccountByKey: async function (account_id, private_key, network, rpc_node, headers) {
        try {
            network = network || "testnet";
            rpc_node = rpc_node || settings.rpc_node;

            private_key = private_key.replace('"', '');

            const keyPair = nearApi.utils.KeyPair.fromString(private_key);
            const keyStore = new nearApi.keyStores.InMemoryKeyStore();
            keyStore.setKey(network, account_id, keyPair);

            const near = await nearApi.connect({
                networkId: network,
                deps: { keyStore },
                masterAccount: account_id,
                nodeUrl: rpc_node,
                headers: (typeof headers !== undefined) ? headers : {}
            });

            return await near.account(account_id);
        } catch (e) {
            return api.reject(e);
        }
    }
};
