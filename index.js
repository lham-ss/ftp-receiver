const FtpSrv = require('ftp-srv');

const port = 21;

const ftpServer = new FtpSrv({
    url: "ftp://0.0.0.0:" + port,
    anonymous: true
});

ftpServer.on('login', (connection, resolve, reject) => {
    if (connection.username === 'anonymous' && connection.password === 'anonymous') {

        connection.on('STOR', (err, fileName) => {
            if (err) {
                console.trace(err);
            }
            else {
                console.log(`*** received ${fileName} via ftp. Trigger data processing here.`);
            }
        });

        return resolve({ root: "/" });
    }
    return reject(new errors.GeneralError('Invalid username or password', 401));
});

ftpServer.listen().then(() => {
    console.log('Ftp server is starting...')
});