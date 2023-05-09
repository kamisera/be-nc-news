# Northcoders News API

## Background

The NC-News API is a service that stores and provides access to a variety of news articles, along with ancillary information such as topics, comments and users. It uses PSQL (with the help of [node-postgres](https://node-postgres.com/)) to store the data.

## How to use

To use this project locally, you must create the following files:

1. `.env.test`: this should contain 1 key called `PGDATABASE` with a value of `new_news_test`
2. `.env.development`: this should contain 1 key called `PGDATABASE` with a value of `nc_news`
