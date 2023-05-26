startButton = () => {
    document.getElementById('startBtn').innerHTML = 'Starting...';
    fetch('/api/startNetwork')
    .then(response => response.json())
    .then(data => { 
        if (data.success){
            console.log('Successfully started');

            // HTML elements
            document.getElementById('startBtn').disabled = true;
            document.getElementById('startBtn').innerHTML = 'Started';
            document.getElementById('stopBtn').disabled = false;
            document.getElementById('stopBtn').innerHTML = 'Stop';
            document.getElementById('refreshBtn').disabled = false;

            var slice1Par = document.getElementById('slice1Par');
            slice1Par.innerHTML = 'ACTIVE';
            slice1Par.style = 'color: #51d315;';

            var slice2Btn = document.getElementById('slice2Btn');
            slice2Btn.disabled = false;
            slice2Btn.style = 'color: #d33215;';
            slice2Btn.innerHTML = 'DISABLED';

            var slice3Btn = document.getElementById('slice3Btn');
            slice3Btn.disabled = false;
            slice3Btn.style = 'color: #d33215;';
            slice3Btn.innerHTML = 'DISABLED';

            // Create iframe - Topology Dysplay
            let iframe = document.createElement('iframe');
            iframe.src = 'http://192.168.56.2:8080/';
            iframe.width = '999px';
            iframe.height = '649px';
            iframe.style = 'border: 0px; margin: 0 auto; display: block;';
            document.getElementById('displayContainer').appendChild(iframe);
        }
    });
}
document.getElementById("startBtn").addEventListener("click", startButton);

stopButton = () => {
    document.getElementById('stopBtn').innerHTML = 'Stopping...';
    fetch('/api/stopNetwork')
    .then(response => response.json())
    .then(data => { 
        if (data.success){
            console.log('Successfully stopped');

            // HTML elements
            document.getElementById('stopBtn').disabled = true;
            document.getElementById('stopBtn').innerHTML = 'Stopped';
            document.getElementById('startBtn').disabled = false;
            document.getElementById('startBtn').innerHTML = 'Start';
            document.getElementById('refreshBtn').disabled = true;

            var slice1Par = document.getElementById('slice1Par');
            slice1Par.innerHTML = 'DISABLED';
            slice1Par.style = 'color: #d33215;';

            var slice2Btn = document.getElementById('slice2Btn');
            slice2Btn.disabled = true;
            slice2Btn.style = 'color: null;';
            slice2Btn.innerHTML = 'DISABLED';

            var slice3Btn = document.getElementById('slice3Btn');
            slice3Btn.disabled = true;
            slice3Btn.style = 'color: null;';
            slice3Btn.innerHTML = 'DISABLED';
        
            // Remove iframe
            let iframe = document.getElementsByTagName('iframe')[0];
            iframe.parentNode.removeChild(iframe);
        
        }
    });
}
document.getElementById("stopBtn").addEventListener("click", stopButton);

refreshButton = () => {
    console.log('Refreshing...');
    refreshBtn = document.getElementById('refreshBtn');
    refreshBtn.innerHTML = 'Refreshing...';
    refreshBtn.style = 'background-size: 0 0;'
    setTimeout(function(){
        document.getElementById('refreshBtn').innerHTML = '';
        let iframe = document.getElementsByTagName('iframe')[0];
        iframe.src = iframe.src;
        refreshBtn.style = 'background-size: 100% 100%;'
    }, 1000);
}
document.getElementById("refreshBtn").addEventListener("click", refreshButton);

// RESET SCENARIO

resetScenario = (eventId) => {
    fetch('/api/resetScenario')
    .then(response => response.json())
    .then(data =>{
        if (data.success){
            var slice2Btn = document.getElementById('slice2Btn');
            slice2Btn.style = 'color: #d33215;';
            setTimeout(function(){
                slice2Btn.innerHTML = 'DISABLED';
            }, 1000);
        }else{
            console.log('Failed to activate Slice 2');
            slice2Btn.innerHTML = 'ERROR';
            setTimeout(function(){
                slice2Btn.innerHTML = 'ACTIVE';
                slice2Btn.style = 'color: #51d315;';
            }, 1000);
        }
    })
}

var slice2Active = false;
var slice3Active = false;

setSliceInfo = () => {
    
}

// SLICE 2 BUTTON

activateSlice2 = () => {
    console.log('Activating Slice 2...');
    slice2Btn = document.getElementById('slice2Btn');
    fetch('/api/activateSlice2')
    .then(response => response.json())
    .then(data => {
        if (data.success){
            console.log('Successfully activated Slice 2');
            slice2Btn.innerHTML = 'ACTIVE';
            slice2Btn.style = 'color: #51d315;';
        }else{
            console.log('Failed to activate Slice 2');
            slice2Btn.innerHTML = 'ERROR';
            setTimeout(function(){
                slice2Btn.innerHTML = 'DISABLED';
                slice2Btn.style = 'color: #d33215;';
            }, 1000);
        } 
    });
}           

// SLICE 3 BUTTON

activateSlice3 = () => {
    console.log('Activating Slice 3...');
    slice3Btn = document.getElementById('slice3Btn');
    slice3Btn.style = 'background-size: 0 0;'
    fetch('/api/activateSlice3')
    .then(response => response.json())
    .then(data => {
        if (data.success){
            console.log('Successfully activated Slice 3');
            slice3Btn.innerHTML = 'DISABLE';
            slice3Btn.style = 'color: #51d315;';
        }else{
            console.log('Failed to activate Slice 3');
            slice3Btn.innerHTML = 'ERROR';
            setTimeout(function(){
                slice3Btn.innerHTML = 'ACTIVATE';
                slice3Btn.style = 'color: #d33215;';
            }, 1000);
        } 
    });
}


activateSlices = (event) => {
    console.log('Slice2:' + slice2Active + " slice3: " + slice3Active)
    id = event.target.id
    if (slice2Active && !slice3Active && id === 'slice3Btn'){
        // activate 2+3
        slice3Active = true;
    }else if(!slice2Active && slice3Active && id === 'slice2Btn'){
        // activate 2+3
        slice2Active = true;
    }else if (id === 'slice2Btn'){
        // activate 2
        if (!slice2Active){
            slice2Active = true;
            activateSlice2();
        }else{
            slice2Active = false;
            resetScenario(id);
        }
    }else if(id === 'slice3Btn'){
        // activate 3
        if (!slice3Active){
            slice3Active = true;
            activateSlice3();
        }else{
            slice3Active = false;
            resetScenario(id);
        }
    }else{
        console.log('Case not handled!');
    }
}

document.getElementById("slice2Btn").addEventListener("click", activateSlices, false);
document.getElementById("slice3Btn").addEventListener("click", activateSlices, false);