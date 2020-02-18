// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const serialport = require('serialport')
const tableify = require('tableify')
const Readline = require('@serialport/parser-readline')

const parser = new Readline()

serialport.list((err, ports) => {
    console.log('ports', ports);
    let comName = ports.filter((item) => item.vendorId == '2341')[0].comName;

    const port = new serialport(comName, {
        baudRate: 9600
    })

    port.pipe(parser)

    parser.on('data', (data) => {
        // document.getElementById('data').textContent = data

        fetch('https://randomuser.me/api/')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                
                document.getElementById('data').textContent = data.results[0].name.first
            });
    })

    if (err) {
        document.getElementById('error').textContent = err.message
        return
    } else {
        document.getElementById('error').textContent = ''
    }

    if (ports.length === 0) {
        document.getElementById('error').textContent = 'No ports discovered'
    }

    // tableHTML = tableify(ports)
    // document.getElementById('ports').innerHTML = tableHTML
})

