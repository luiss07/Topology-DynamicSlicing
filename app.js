const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const {spawn} = require('child_process');
const {exec} = require('child_process');
const { kill } = require('process');

// URL site: http://192.168.56.2:8081
const PORT = 8081; // Use port 8081 because port 8080 is used by mininet
var PID = 0; // PID of child process

const startPath = '/home/vagrant/comnetsemu/Topology-DynamicSlicing/script/start.sh'
const resetScenario = '/home/vagrant/comnetsemu/Topology-DynamicSlicing/script/resetScenario.sh'
const defaultScenario = '/home/vagrant/comnetsemu/Topology-DynamicSlicing/script/defaultScenario.sh'
const slice2Scenario = '/home/vagrant/comnetsemu/Topology-DynamicSlicing/script/slice2Scenario.sh'

app.use(express.static(__dirname + '/html'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var ryuProcess = null;
var topologyProcess = null;

// function to set the bandwitdh limit for h2 and h3
seth2h3limit = (topologyProcess) => {
    setTimeout(function(){
        topologyProcess.stdin.write("h2 tc qdisc add dev h2-eth0 root tbf rate 10mbit burst 100kb limit 10000\n", () => {});
        topologyProcess.stdin.write(" h3 tc qdisc add dev h3-eth0 root tbf rate 10mbit burst 100kb limit 10000\n");
    }, 4000);
}

app.get('/api/startNetwork', (req, res) => {

    console.log('Called API start network');

    ryuProcess = spawn('bash', [startPath]);

    // Get the PID of the child process
    PID = ryuProcess.pid;

    topologyProcess = exec(`sudo python3 ./topologyVisualizer/topology.py`, (err, stdout, stderr) => {
        if (err) {
            console.log(`Topology error: ${err.message}`);
        }else{
            console.log("Topology executed:\n" + stdout);
        }
    });

    setTimeout(function(){
        const childDefScenario = exec('sh ' + defaultScenario, (err, stdout, stderr) => {
            if (err) {
                console.log(`Default scenario error: ${err.message}`);
            }else{
                console.log("Default scenario executed:\n" + stdout);
            }
        });
    }, 3000);

    // Redirect stdout and stderr of the child process to the terminal

    topologyProcess.stdout.pipe(process.stdout);
    topologyProcess.stderr.pipe(process.stderr);
    process.stdin.pipe(topologyProcess.stdin);

    topologyProcess.on('error', (error) => {
    console.error(`Error executing the topology script: ${error}`);
    });

    topologyProcess.on('close', (code) => {
    console.log(`Topology script execution finished with code ${code}`);
    });

    topologyProcess.on('exit', function(code, signal) {
        console.log('Topology process terminated with code: ' + code);
    });

    // ---- Ryu controller ----
    ryuProcess.on('error', (error) => {
        console.error(`Error executing the Ryu script: ${error}`);
    });

    ryuProcess.on('close', (code) => {
        console.log(`Ruy script execution finished with code ${code}`);
    });

    ryuProcess.on('exit', function(code, signal) {
        console.log('Ryu script terminated with code: ' + code);
    });

    seth2h3limit(topologyProcess); // Set limit for h2 and h3 to 10mbit

    if (ryuProcess.pid && topologyProcess.pid){
        setTimeout(function(){
            console.log("Returned true in startNetwork")
            res.json({success: true});
        }, 4000);
    }else{
        console.log("Returned false in startNetwork")
        res.json({success: false});
    }
})  

app.use('/api/stopNetwork', function(req, res) {

    console.log('Called API stop network');

    topologyProcess.stdout.pipe(process.stdout).unpipe;
    topologyProcess.stderr.pipe(process.stderr).unpipe;
    process.stdin.pipe(topologyProcess.stdin).unpipe;

    // Kill the topology process
    exec(`kill ${topologyProcess.pid}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`Killing process error: ${error.message}`);
        }else{
            console.log("Topology process terminated");
        }
    });
    // Kill the Ryu process
    exec(`kill ${ryuProcess.pid}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`Killing process error: ${error.message}`);
        }else{
            console.log("Ryu process terminated");
        }
    });        

    setTimeout(function(){
        if (ryuProcess.pid && topologyProcess.pid){
            res.json({success: true});
        }else{
            res.json({success: false});
        }
    }, 2000);
});

app.use('/api/resetScenario', function(req, res) {
    console.log('Called API reset scenario');

    exec('sh' + resetScenario);

    const childDefScenario = exec('sh ' + defaultScenario, (err, stdout, stderr) => {
        if (err) {
            console.log(`Default scenario error: ${err.message}`);
            res.json({success: false});
        }else{
            console.log("Default scenario executed:\n" + stdout);
            res.json({success: true});
        }
    });
});

app.use('/api/activateSlice2', function(req, res) {
    console.log('Called API activate slice 2');

    setTimeout(function(){
        const childSlice2 = exec('sh ' + slice2Scenario, (err, stdout, stderr) => {
            if (err) {
                console.log(`Slice 2 scenario error: ${err.message}`);
                res.json({success: false});
            }else{
                console.log('Slice 2 scenario executed:\n' + stdout);
                res.json({success: true});
            }
        });
    }, 2000);
});

app.use('/api/activateSlice3', function(req, res) {

});

app.listen(PORT, function() {
    console.log('Server is listening on Port: ', PORT);
});