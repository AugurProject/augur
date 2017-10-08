"use strict";

var BLOCKS_PER_CHUNK = require("../constants").BLOCKS_PER_CHUNK;

function chunkBlocks(fromBlock, toBlock) {
  var toBlockChunk, fromBlockChunk, chunks;
  if (fromBlock < 1) fromBlock = 1;
  if (toBlock < fromBlock) return [];
  toBlockChunk = toBlock;
  fromBlockChunk = toBlock - BLOCKS_PER_CHUNK;
  chunks = [];
  while (toBlockChunk >= fromBlock) {
    if (fromBlockChunk < fromBlock) {
      fromBlockChunk = fromBlock;
    }
    chunks.push({ fromBlock: fromBlockChunk, toBlock: toBlockChunk });
    fromBlockChunk -= BLOCKS_PER_CHUNK;
    toBlockChunk -= BLOCKS_PER_CHUNK;
    if (toBlockChunk === toBlock - BLOCKS_PER_CHUNK) {
      toBlockChunk--;
    }
  }
  return chunks;
}

module.exports = chunkBlocks;
