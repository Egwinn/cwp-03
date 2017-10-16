const net = require('net');
const fs = require('fs');
const port = 8124;
const clientString = 'QA';
const good = 'ACK';
const bad = 'DEC';
const log = fs.createWriteStream('client_id.log');
let seed = 0;

const server = net.createServer((client) => {
  console.log('Client connected');
  client.setEncoding('utf8');

  client.on('data', (data, err) => {
    if (err) console.error("Ошибка получения информации от клиента");
    else if (data === clientString) {
      client.id = Date.now() + seed++;
      log.write('Client #' + client.id + ' connected\n');
      client.write(data === clientString ? good : bad);
    }
    else if (data !== clientString) {
      log.write('Client #' + client.id + ' has asked: ' + data + '\n');
      let answer = generateAnswer();
      log.write('Server answered to Client #' + client.id + ': ' + answer + '\n');
      client.write(answer);
    }
});

  client.on('end', () =>
  {
    log.write('Client #'+ client.id+ ' disconnected\n');
    console.log('Client disconnected\n')
  });
});

server.listen(port, () => {
  console.log(`Server listening on localhost: ${port}\n`);
});

function generateAnswer(){
  return Math.random() > 0.5 ? '1' : '0';
}

