function checkWork() {
    if (eth.getBlock("pending").transactions.length > 0) {
        if(!eth.mining) miner.start();
    } else {
        miner.stop();
    }
}

setInterval(function() { checkWork(); }, 500);

eth.watch("latest", function (err, block) { checkWork(); });
