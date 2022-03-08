/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable radix */
/* eslint-disable no-unsafe-negation */
/* eslint-disable no-new-object */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-underscore-dangle */
const Sequelize = require('sequelize');
const path = require('path');
const Queuing = require('./queue');

const dbQueue = new Queuing();

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: path.resolve('./Data/db.sqlite'),
  operatorsAliases: 0,
  logging: 0,
});

module.exports = {
  sequelize,
  dbQueue,
};
