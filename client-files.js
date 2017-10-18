const net = require('net');
const fs = require('fs');
const path = require('path');
const port = 8124;
const startString = 'FILES';
const bad = 'DEC';
const good = 'ACK';
const directories = process.argv.slice(2);

const client = new net.Socket();
client.setEncoding('utf-8');

client.connect(port, function() {
    client.write(startString);
    console.log("Connected");
});

client.on("data", function(data) {
    if(data === good) {
        directories.forEach((value) => {
            ReadFilesInDirectory(value);
        });
        sendFilesToServer();
    }
    if(data === bad) {
        client.destroy();
    }
})

client.on("close", function() {
    console.log("Connection closed");
})

function ReadFilesInDirectory(dirPath) {
    fs.readdirSync(dirPath).forEach((value) => {
        let filePath = path.normalize(dirPath + path.sep + value);
        if(fs.statSync(filePath).isFile()) {
            files.push(filePath);
        } else {
            ReadFilesInDirectory(filePath);
        }
    })
}

function sendFilesToServer() {
    for (let i = 0; i < files.length; ++i)
    {
        let filePath = files.pop();
        client.write(fs.readFileSync(filePath));
    }
    client.destroy();
}