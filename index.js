require('dotenv').config();

const FtpSrv = require('ftp-srv');

const port = process.env.FTP_PORT ?? 21;


const { networkInterfaces } = require('os');
const { Netmask } = require('netmask');

const nets = networkInterfaces();
function getNetworks() {
    let networks = {};
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                networks[net.address + "/24"] = net.address
            }
        }
    }
    return networks;
}

const resolverFunction = (address) => {
    const networks = getNetworks();

    console.log('***************** HERE WE ARE ********************');

    for (const network in networks) {
        if (new Netmask(network).contains(address)) {
            return networks[network];
        }
    }

    return "127.0.0.1";
}

const ftpServer = new FtpSrv({
    url: "ftp://0.0.0.0:" + port,
    "pasv_url": resolverFunction,
    pasv_min: 49152,
    pasv_max: 65535,
    anonymous: false,
});

const fileReceivedEvent = (err, fileName) => {
    if (err) {
        console.trace(err);
    }
    else {
        console.log(`\n*** Received ${fileName} via ftp!\n*** Here we can parse data out of ${fileName} for storage.\n\n`);
        // handle file here
    }
};

ftpServer.on('login', (ftp, resolve, reject) => {
    if (ftp.username === process.env.FTP_USERNAME &&
        ftp.password === process.env.FTP_PASSWORD) {

        ftp.connection.on('STOR', fileReceivedEvent);

        return resolve({ root: "/tmp/rivenrock" });
    }

    return reject(new FtpSrv.ftpErrors.GeneralError('Invalid username or password', 401));
});


console.log(getNetworks());


ftpServer.listen().then(() => {
    console.log(`\n*** FTP server listening to port ${port}...\n`);
});