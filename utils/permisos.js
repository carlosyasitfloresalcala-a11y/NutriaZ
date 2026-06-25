const { PermissionFlagsBits } = require("discord.js");
const config = require("../config");

function esAdmin(member) {
  return member.permissions.has(PermissionFlagsBits.Administrator) ||
    member.roles.cache.has(config.adminRoleId);
}

module.exports = { esAdmin };