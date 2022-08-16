/* eslint-disable react-hooks/rules-of-hooks */
const {
  override,
  addExternalBabelPlugin,
  useBabelRc
} = require("customize-cra");

const relayBabelPlugin = require("babel-plugin-relay");


module.exports = {
  webpack: override(
    useBabelRc(),
    addExternalBabelPlugin(relayBabelPlugin)
  ),
};