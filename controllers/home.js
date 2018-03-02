'use strict';

const bitcoin = require('bitcoin');
const unirest = require('unirest');

// all config options are optional
var client = new bitcoin.Client({
    host: process.env.DNRHOST,
    port: process.env.DNRPORT,
    user: process.env.DNRUSER,
    pass: process.env.DNRPASS,
    timeout: 30000
});

var sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

/**
 * GET /
 * Home page.
 */
exports.index = function (req, res) {

    //Masternode Count
    client.masterNode('count', function (error, count, resHeaders) {
        if (error) return console.log(error);

        if (count <= 0) {
            count = 0;
        }

        //Hashes per sec
        client.getHashesPerSec(function (error, hashespersec, resHeaders) {
            if (error) return console.log(error);

        //Mining info
        client.getMiningInfo(function (error, mininginfo, resHeaders) {
            if (error) return console.log(error);

            var powdiff = mininginfo['difficulty']['proof-of-work'];
            var posdiff = mininginfo['difficulty']['proof-of-stake'];
            var posweight = mininginfo['netstakeweight'];
            var blockcount = mininginfo['blocks'];

        //List Masternodes
        client.masterNode('list', function (err, masternodelists, resHeaders) {
            if (err) return console.log(err);

                unirest.get("https://api.coinmarketcap.com/v1/ticker/denarius-dnr/")
                    .headers({ 'Accept': 'application/json' })
                    .end(function (result) {
                        var usdprice = result.body[0]['price_usd'];
                        var btcprice = result.body[0]['price_btc'];
                        var marketcap = result.body[0]['market_cap_usd'];
                        var totalsupply = result.body[0]['total_supply'];
                        var maxsupply = result.body[0]['max_supply'];
                        var dailyvolume = result.body[0]['24h_volume_usd'];

                        var totalmncostusd = 5000 * usdprice;
                        var totalmncostbtc = 5000 * btcprice;
                        var totalmnvalue = totallocked * usdprice;
                        var totallocked = count * 5000;

                        var totalmnpercent = (totallocked / totalsupply) * 100;
                        
                        res.render('home', { title: 'Denarius Statistics', count: count, blockcount: parseFloat(blockcount).toLocaleString('en-US'), masternodelists: masternodelists, powdiff: parseFloat(powdiff).toFixed(2), posdiff: parseFloat(posdiff).toFixed(8), posweight: parseFloat(posweight).toFixed(2), dailyvol: parseFloat(dailyvolume).toLocaleString('en-US', { minimumFractionDigits: 2 }), marketcap: parseFloat(marketcap).toLocaleString('en-US', { minimumFractionDigits: 2 }), usd: parseFloat(usdprice).toFixed(2), btc: parseFloat(btcprice).toFixed(8), totallockedup: parseFloat(totallocked).toLocaleString('en-US'), mnsupplypercent: parseFloat(totalmnpercent).toFixed(2), hashespersec: parseFloat(hashespersec).toLocaleString('en-US'), totalmnusd: parseFloat(totalmncostusd).toLocaleString('en-US', { minimumFractionDigits: 2 }), totalmnbtc: parseFloat(totalmncostbtc).toFixed(2), totalmnvalue: totalmnvalue, totalsupply: parseFloat(totalsupply).toLocaleString('en-US') });
                    });
            });
            });
        });
    });
    /**
    var batch = [];
    for (var i = 0; i < 10; ++i) {
        batch.push({
            method: 'getbalance',
            params: [`dnrw(${username})`],
            method: 'getaddressesbyaccount',
            params: [`dnrw(${username})`]
        });
    }
    client.cmd(batch, function (err, balance, addresses, resHeaders) {
        if (err) return console.log(err);

        console.log(`${username}`, 'Addresses:', addresses, 'Balance:', balance);
    });
    */
};