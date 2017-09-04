"use strict";

// warning: mutates processedLogs
function insertIndexedLog(processedLogs, parsed, index) {
  if (Array.isArray(index)) {
    if (index.length === 1) {
      if (!processedLogs[parsed[index[0]]]) {
        processedLogs[parsed[index[0]]] = [];
      }
      processedLogs[parsed[index[0]]].push(parsed);
    } else if (index.length === 2) {
      if (!processedLogs[parsed[index[0]]]) {
        processedLogs[parsed[index[0]]] = {};
      }
      if (!processedLogs[parsed[index[0]]][parsed[index[1]]]) {
        processedLogs[parsed[index[0]]][parsed[index[1]]] = [];
      }
      processedLogs[parsed[index[0]]][parsed[index[1]]].push(parsed);
    } else if (index.length === 3) {
      if (!processedLogs[parsed[index[0]]]) {
        processedLogs[parsed[index[0]]] = {};
      }
      if (!processedLogs[parsed[index[0]]][parsed[index[1]]]) {
        processedLogs[parsed[index[0]]][parsed[index[1]]] = {};
      }
      if (!processedLogs[parsed[index[0]]][parsed[index[1]]][parsed[index[2]]]) {
        processedLogs[parsed[index[0]]][parsed[index[1]]][parsed[index[2]]] = [];
      }
      processedLogs[parsed[index[0]]][parsed[index[1]]][parsed[index[2]]].push(parsed);
    }
  } else {
    if (!processedLogs[parsed[index]]) processedLogs[parsed[index]] = [];
    processedLogs[parsed[index]].push(parsed);
  }
}

module.exports = insertIndexedLog;
