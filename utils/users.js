/* eslint-disable eqeqeq */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
const Sequelize = require('sequelize');
const { sequelize, dbQueue } = require('./dbUtils');

const DB = sequelize.define('UserInfos', {
  userID: {
    type: Sequelize.STRING,
    unique: true,
  },
  lang: Sequelize.STRING,
});
DB.sync();

module.exports.SetLang = function (UserID, toSet) {
  return dbQueue.addToQueue({
    value: _SetLang.bind(this),
    args: [UserID, toSet],
  });
};

module.exports.Fetch = function (UserID) {
  return dbQueue.addToQueue({
    value: _Fetch.bind(this),
    args: [UserID],
  });
};

async function _SetLang(UserID, toSet) {
  if (!UserID || toSet == undefined) throw new Error('SetLang function is missing parameters!');
  return new Promise(async (resolve, error) => {
    const Info = await DB.update({
      lang: toSet,
    }, {
      where: {
        userID: UserID,
      },
    });
    if (Info > 0) {
      return resolve({
        userid: UserID,
        lang: toSet,
      });
    }
    try {
      const Info2 = await DB.create({
        userID: UserID,
        lang: 'FR',
      });
      return resolve({
        userid: UserID,
        lang: toSet,
      });
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve('Duplicate Found, shouldn\'t happen in this function, check typo\'s');
      }
      return error(e);
    }
  });
}

async function _Fetch(UserID) {
  if (!UserID) throw new Error('Fetch function is missing parameters!');
  return new Promise(async (resolve, error) => {
    const Info = await DB.findOne({
      where: {
        userID: UserID,
      },
    });
    if (Info) {
      return resolve({
        userid: Info.userID,
        lang: Info.lang,
      });
    }
    try {
      await DB.create({
        userID: UserID,
        lang: 'FR',
      });
      return resolve({
        userid: UserID,
        lang: 'FR',
      });
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve('Duplicate Found, shouldn\'t happen in this function, check typo\'s');
      }
      return error(e);
    }
  });
}
