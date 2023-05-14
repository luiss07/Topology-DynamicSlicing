const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const {spawn} = require('child_process');
const {exec} = require('child_process');

// URL site: http://192.168.56.2:8081
const PORT = 8081; // Use port 8081 because port 8080 is used by mininet
var PID = 0; // PID of child process

const startPath = '/home/vagrant/comnetsemu/Topology-DynamicSlicing/script/start.sh'

app.use(express.static(__dirname + '/html'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/startNetwork', (req, res) => {

    console.log('Called API start network');
    //Spawn child process
    const child = spawn('bash', [startPath]);

    PID = child.pid; //Retreive child process PID

    process.stdin.pipe(child.stdin); // Pipe parent process stdin to child process stdin

    //When child process writes to stdout
    child.stdout.on('data', (data) => { 
        console.log(`stdout: ${data}`);
    });

    //When child process writes to stderr
    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    //When child process terminates
    child.on('exit', function(code, signal) {
        console.log('Child terminated with code: ' + code);
    });
    if (child.pid){
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

app.listen(PORT, function() {
    console.log('Server is listening on Port: ', PORT);
});