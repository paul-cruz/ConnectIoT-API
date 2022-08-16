# NEAR REST API SERVER FOR Connect IoT

> ### This repository is a specific implementation for the Connect IoT project based on the official [NEAR REST API SERVER repository](https://github.com/near-examples/near-api-rest-server) following its license, so if you use this code, keep in mind to check its protection.

---

## Overview

_Click on a route for more information and examples_

| Route                                      | Method | Description                                                                                                                 |
| ------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| **CONNECT IOT CONTRACT**                   |        |                                                                                                                             |
| [`/call`](#call)                           | POST   | Performs a call to the smart contract, validating the method                                                                |

---

## Requirements

- [NEAR Account](https://docs.near.org/concepts/basics/account) _(with access to private key or seed phrase)_
- [Node.js](https://nodejs.org/en/download/package-manager/)
- [npm](https://www.npmjs.com/get-npm) or [Yarn](https://yarnpkg.com/getting-started/install)
- API request tool such as [Postman](https://www.postman.com/downloads/)
- Crear archivo .env conteniendo el id del contrato:
```
NEAR_CONTRACT_ID=dev-1659666583036-94152895119798
```

---

## Setup

1. Clone repository

```bash
https://github.com/paul-cruz/Connect-IoT-API.git
```

2. Install dependencies

```bash
npm install
```

3. Configure `near-api-server.config.json`
Default settings:

```json
{
  "server_host": "0.0.0.0",
  "server_port": 5000,
  "rpc_node": "https://rpc.testnet.near.org",
  "init_disabled": true
}
```

4. Start server

```bash
node app
```

---

# Contract

## `/call`

> _Performs a call to the smart contract, validating the method._

**Method:** **`POST`**

**Valid methods:** 
- **`POST`**
- **`create_registry`**,
- **`delete_registry`**,
- **`add_device_to_registry`**,
- **`delete_device_from_registry`**,
- **`set_device_data`**,
- **`get_device_data`**,
- **`set_device_data_param`**,
- **`get_device_data_param`**,
- **`set_device_metadata`**,
- **`get_device_metadata`**,
- **`set_device_metadata_param`**,
- **`get_device_metadata_param`**

| Param                            | Description                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `account_id`                     | _Account id that will be performing the call and will be charged for gas and attached tokens / deposit._              |
| `seed_phrase` _OR_ `private_key` | _Seed phrase OR private key of the account id above._                                                                 |
| `method`                         | _A valid method for the ConnectIoT method._                                                                           |
| `params`                         | _Arguments the method of the contract takes._                                                                         |

_**Note:** Use [`near login`](https://docs.near.org/docs/tools/near-cli#near-login) to save your key pair to your local machine._

Example:

```json
{
  "account_id": "paulcruz.testnet",
  "private_key": "5a92dJw8NtnwPZmHAuCt3M123pE1aD2wM5z7BkTasdnCxbEHX22Gei2jnoWjaGcZUk2ZZtPriMa25CLpcp96s7Mw",
  "method": "get_device_metadata_param",
  "params": {"registry_name": "my_registry", "device_name": "my_device", "param": "timestamp"}
}
```


<details>
<summary><strong>Example Response:</strong> </summary>
<p>

```json
{
    "data": "1659740812726"
}
```

</p>
</details>


Example:

```json
{
  "account_id": "paulcruz.testnet",
  "private_key": "5a92dJw8NtnwPZmHAuCt3M123pE1aD2wM5z7BkTasdnCxbEHX22Gei2jnoWjaGcZUk2ZZtPriMa25CLpcp96s7Mw",
  "method": "get_device_metadata",
  "params": {"registry_name": "my_registry", "device_name": "my_device", "param": "timestamp"}
}
```


<details>
<summary><strong>Example Response:</strong> </summary>
<p>

```json
{
    "read_type": "streaming",
    "timestamp": "1659740812726",
    "area": "west"
}
```

</p>
</details>

---
