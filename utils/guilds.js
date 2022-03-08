/* eslint-disable eqeqeq */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
const Sequelize = require('sequelize');
const { sequelize, dbQueue } = require('./dbUtils');

const DB = sequelize.define('GuildsInfos', {
  guildID: {
    type: Sequelize.STRING,
    unique: true,
  },
  channelsId: Sequelize.STRING,
});
DB.sync();

module.exports.SetTranslateChannels = function (GuildID, toSet) {
  return dbQueue.addToQueue({
    value: _SetTranslateChannels.bind(this),
    args: [GuildID, toSet],
  });
};

module.exports.Fetch = function (GuildID) {
  return dbQueue.addToQueue({
    value: _Fetch.bind(this),
    args: [GuildID],
  });
};

async function _SetTranslateChannels(GuildID, toSet) {
  if (!GuildID || toSet == undefined) throw new Error('SetTranslateChannels function is missing parameters!');
  return new Promise(async (resolve, error) => {
    const Info = await DB.update({
      channelsId: toSet,
    }, {
      where: {
        guildID: GuildID,
      },
    });
    if (Info > 0) {
      return resolve({
        guildid: GuildID,
        channelsId: toSet,
      });
    }
    try {
      const Info2 = await DB.create({
        guildID: GuildID,
        channelsId: null,
      });
      return resolve({
        guildid: GuildID,
        channelsId: toSet,
      });
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve('Duplicate Found, shouldn\'t happen in this function, check typo\'s');
      }
      return error(e);
    }
  });
}

async function _Fetch(GuildID) {
  if (!GuildID) throw new Error('Fetch function is missing parameters!');
  return new Promise(async (resolve, error) => {
    const Info = await DB.findOne({
      where: {
        guildID: GuildID,
      },
    });
    if (Info) {
      return resolve({
        guildid: Info.guildID,
        channelsId: Info.channelsId,
      });
    }
    try {
      await DB.create({
        guildID: GuildID,
        channelsId: null,
      });
      return resolve({
        guildid: GuildID,
        channelsId: null,
      });
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return resolve('Duplicate Found, shouldn\'t happen in this function, check typo\'s');
      }
      return error(e);
    }
  });
}
