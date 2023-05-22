const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const {spawn} = require('child_process');
const {exec} = require('child_process');

// URL site: http://192.168.56.2:8081
const PORT = 8081; // Use port 8081 because port 8080 is used by mininet
var PID = 0; // PID of child process

const startPath = '/home/vagrant/comnetsemu/Topology-DynamicSlicing/script/start.sh'
const defaultScenario = '/home/vagrant/comnetsemu/Topology-DynamicSlicing/script/defaultScenario.sh'

app.use(express.static(__dirname + '/html'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/startNetwork', (req, res) => {

    console.log('Called API start network');

    const childProcess = exec(`sh ${startPath}`);

    // Get the PID of the child process
    PID = childProcess.pid;

    const childTopology = exec(`sudo python3 ./topologyVisualizer/topology.py`, (err, stdout, stderr) => {
        if (err) {
            res.json({success: false});
        }
    });

    setTimeout(function(){
        const childDefScenario = exec('sh ' + defaultScenario, (err, stdout, stderr) => {
            if (err) {
                console.log(`Default scenario error: ${err.message}`);
            }else{
                console.log("Default scenario executed:\n" + stdout);
                process.stdout.write("mininet> ");
            }
        });
    }, 3000);

    // Redirect stdout and stderr of the child process to the terminal

    childTopology.stdout.pipe(process.stdout);
    childTopology.stderr.pipe(process.stderr);
    process.stdin.pipe(childTopology.stdin);

    childTopology.on('error', (error) => {
    console.error(`Error executing the script: ${error}`);
    });

    childTopology.on('close', (code) => {
    console.log(`Script execution finished with code ${code}`);
    });

    //When child process terminates
    childTopology.on('exit', function(code, signal) {
        console.log('Child terminated with code: ' + code);
    });



    if (childProcess.pid){
        setTimeout(function(){
            res.json({success: true});
        }, 4000);
    }else{
        res.json({success: false});
    }
})  

app.use('/api/stopNetwork', function(req, res) {

    exec('kill ' + PID, (error, stdout, stderr) => {
        if (error) {
            console.log(`Killing process error: ${error.message}`);
            res.json({success: false});
        }else{
            console.log("Child process terminated");
            setTimeout(function(){
                res.json({success: true});
            }, 2000);
        }
    });
});

app.use('/api/slice2', function(req, res) {

});

app.use('/api/slice3', function(req, res) {

});

app.listen(PORT, function() {
    console.log('Server is listening on Port: ', PORT);
});