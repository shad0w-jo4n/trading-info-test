# Trading Info
Service for obtaining currency exchange rates.

## Table of Contents
* [Requirements](#requirements)
* [Deployment](#deployment)
    * [Local](#local)
    * [Docker Compose](#docker-compose)
* [CLI](#cli)
* [Environment Variables](#environment-variables)
* [API](#api)
    * [Basic Info](#basic-info)
    * [Methods List](#methods-list)
        * [HelloWorld](#1-helloworld)
        * [GetOne](#2-getone)
        * [GetCurrenciesRates](#3-getcurrenciesrates)
* [Service configuration for docker-compose stack](#service-configuration-for-docker-compose-stack)
    * [App Replication](#app-replication)
    * [PostgreSQL Configuration](#postgresql-configuration)
    * [NGINX Configuration](#nginx-configuration)

## Requirements
1. Node.js (>=16.0)
2. Redis (>=6.2.6)
3. PostgreSQL (>=14.1) with TimescaleDB (>= 2.5.1)

## Deployment

### Local
1. Install dependencies: `npm install`.
2. Run migrations: `npm run migration:run` with `DATABASE_URL` [environment variable](#environment-variables).
3. Run project: `npm run start:dev` with [environment variables](#environment-variables).

### Docker Compose
`docker-compose -f docker/application.yml up`

More configurations see [here](#service-configuration-for-docker-compose-stack).

## CLI
* `npm run prebuild` - Clear `dist` folder.
* `npm run build` - Compile TypeScript source code to JavaScript at `dist` folder.
* `npm run start` - Run compiled application. Need [environment variables](#environment-variables).
* `npm run start:dev` - Build and start application. Need [environment variables](#environment-variables).
* `npm run migration:create -- {name}` - Create database migration file with `{name}`. Need `DATABASE_URL` [environment variable](#environment-variables).
* `npm run migration:run` - Start database migrations. Need `DATABASE_URL` [environment variable](#environment-variables).
* `npm run migration:down` - Revert last database migration. Need `DATABASE_URL` [environment variable](#environment-variables).

## Environment Variables

| Environment Variable           | Description                                                | Example                                             |
|--------------------------------|------------------------------------------------------------|-----------------------------------------------------|
| `REDIS_URL`                    | URL for connecting to Redis                                | `redis://localhost:6379/`                           |
| `DATABASE_URL`                 | URL for connecting to PostgeSQL                            | `postgresql://user:password@localhost:5432/db`      |
| `CURRENCIES_FROM`              | List of currencies to convert from                         | `BTC,ETH,MNR`                                       |
| `CURRENCIES_TO`                | List of currencies to convert to                           | `USD,EUR,RUB`                                       |
| `CURRENCIES_RATE_UPDATER_CRON` | Crontab for worker, that save currencies rates to database | `*/1 * * * *`                                       |
| `CRYPTOCOMPARE_PRICEMULTI_URL` | URL to CryptoCompare API for getting currencies rates      | `https://min-api.cryptocompare.com/data/pricemulti` |

## API

### Basic Info
This application use [socket.io](https://socket.io/) for WebSocket server.
API use custom RPC inspired JSON-RPC under WebSocket.

The Request object has the following members:
* `method` - Name of method.
* `args` - Object for passing arguments.

The Response object has the following members:

* `status` - Result status of method execution. `Ok` or `Error`.
* `data` - Object for result data.
* `message` - Error message.

### Methods List

#### 1. HelloWorld
Returns string `Hello, world!`

Args: `undefined`

Data: `string`

Example Request:

```json
{
  "method": "HelloWorld"
}
```

Example Response:

```json
{
  "status": "Ok",
  "data": "Hello, world!"
}
```

#### 2. GetOne
Returns number `1`

Args: `undefined`

Data: `number`

Example Request:

```json
{
  "method": "GetOne"
}
```

Example Response:

```json
{
  "status": "Ok",
  "data": 1
}
```

#### 3. GetCurrenciesRates
Returns currencies rates

Args:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "from": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "to": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "from",
    "to"
  ]
}
```

Data:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "from": {
        "type": "string"
      },
      "to": {
        "type": "string"
      },
      "price": {
        "type": "number"
      },
      "date": {
        "type": "string"
      }
    },
    "required": [
      "from",
      "to",
      "price",
      "date"
    ]
  }
}
```

Additional Info:

| Cache | 1 minute |
|-------|----------|

Example Request:

```json
{
  "method": "GetCurrenciesRates",
  "args": {
    "from": ["BTC", "ETH"],
    "to": ["USD"]
  }
}
```

Example Response:

```json
{
  "status": "Ok",
  "data": [
    {
      "from": "BTC",
      "to": "USD",
      "price": 43958.55,
      "date": "2022-01-13T00:11:45.065Z"
    },
    {
      "from": "ETH",
      "to": "USD",
      "price": 3376.76,
      "date": "2022-01-13T00:11:45.065Z"
    }
  ]
}
```

## Service configuration for docker-compose stack

### App Replication
You can change replicas count of application in `docker/application.yml`.

By default, there are 4 replicas for the application.

More options [here](https://docs.docker.com/compose/).

### PostgreSQL Configuration
You can change some options for PostgeSQL in `docker/postgresql/postgresql.conf`.

By default, it listens from all hosts and loads TimescaleDB plugin.

More information about PostgreSQL [here](https://www.postgresql.org/docs/14/index.html).

More information about TimescaleDB [here](https://docs.timescale.com/timescaledb/latest).

### NGINX Configuration
You can change some options for NGINX in `docker/nginx/nginx.conf`.

By default, NGINX listens 3000 port and proxy pass it with upstream to application on 3000 port.

More information about NGINX [here](https://nginx.org/en/docs/).
