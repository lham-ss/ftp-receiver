const FtpSrv = require('ftp-srv');

const port = 21;

const ftpServer = new FtpSrv({
    url: "ftp://0.0.0.0:" + port,
    anonymous: false,
});

const fileReceivedEvent = (err, fileName) => {
    if (err) {
        console.trace(err);
    }
    else {
        console.log(`\n\n*** received ${fileName} via ftp!\n\nnow we will process the file and save the data!\n\n`);
        // handle file here
    }
};

ftpServer.on('login', (ftp, resolve, reject) => {
    if (ftp.username === 'rivenrock' && ftp.password === '@rivenRock') {

        ftp.connection.on('STOR', fileReceivedEvent);

        return resolve({ root: "/ftp" });
    }

    return reject(new FtpSrv.ftpErrors.GeneralError('Invalid username or password', 401));
});


ftpServer.listen().then(() => {
    console.log('Ftp server is starting...')
});