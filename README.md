# NewsHub API

NewsHub API is a RESTful API that stores and provides access to a variety of news articles, along with ancillary information such as topics, comments and users.

It uses PSQL (with the help of [node-postgres](https://node-postgres.com/)) to manage the data.

This API also uses [express](https://github.com/expressjs/express), [pg](https://github.com/brianc/node-postgres) and [pg-format](https://github.com/datalanche/node-pg-format), [dotenv](https://github.com/motdotla/dotenv) as dependencies and [jest](https://github.com/jestjs/jest) and [supertest](https://github.com/ladjs/supertest) for testing.

Live demo [here](https://nc-news-v4me.onrender.com/api/).

## Requirements

- Node.js (v20.0.0 or higher)
- PostgreSQL (v14.7 or higher)

## How to use (locally)

To use this project locally, do the following:

1. Clone or fork this repository

   > `git clone https://github.com/kamisera/be-nc-news`

2. Install dependencies using npm or yarn

   > `npm install`

   or

   > `yarn`

3. Create local environment files for your database connection

   #### `.env.development` _(for development)_:

   > `PGDATABASE=nc_news`

   #### `.env.test` _(for test scripts)_:

   > `PGDATABASE=nc_news_test`

4. Setup your databases

   > `npm run setup-dbs`

   or

   > `yarn setup-dbs`

5. Seed your database with the included data

   > `npm run seed`

   or

   > `yarn seed`

6. Run the server

   > `npm start`

   or

   > `yarn start`

## How to test

To run unit and integration tests, run the following script:

> `npm test`

or

> `yarn test`

## How to deploy (remotely)

1. Create an environment file or use this as an example for the variables needed

   #### `.env.production`:

   > `DATABASE_URL=your_url_here`

2. Seed your production database (optional)

   > `npm run seed-prod`

   or

   > `yarn seed-prod`
