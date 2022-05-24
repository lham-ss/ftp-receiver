require('dotenv').config();

const FtpSrv = require('ftp-srv');

const port = process.env.FTP_PORT ?? 21;


const resolverFunction = (address) => {
    console.log('\n\nresolverFunction: ', address);

    return "54.184.195.144";
}

const ftpServer = new FtpSrv({
    url: "ftp://0.0.0.0:" + port,
    pasv_url: resolverFunction,
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


ftpServer.listen().then(() => {
    console.log(`\n*** FTP server listening to port ${port}...\n`);
});