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

            setSliceInfo('default');

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

            setSliceInfo('null');
        
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
    var sliceBtn = document.getElementById(eventId);
    sliceBtn.innerHTML = ''
    sliceBtn.classList.add("button--loading"); // toggle loading animation

    fetch('/api/resetScenario')
    .then(response => response.json())
    .then(data =>{
        if (data.success){
            sliceBtn.classList.remove("button--loading"); // disable loading animation
            sliceBtn.style = 'color: #d33215;';
            setTimeout(function(){
                sliceBtn.innerHTML = 'DISABLED';
                setSliceInfo('default')
            }, 1000);
        }else{
            console.log('Failed to deactivate scenario');
            sliceBtn.innerHTML = 'ERROR';
            setTimeout(function(){
                sliceBtn.innerHTML = 'ACTIVE';
                sliceBtn.style = 'color: #51d315;';
            }, 1000);
        }
    })
}

var slice2Active = false;
var slice3Active = false;

setSliceInfo = (sliceName) => {
    slice1Info = document.getElementById('slice1Info');
    slice2Info = document.getElementById('slice2Info');
    slice3Info = document.getElementById('slice3Info');

    switch (sliceName){
        case 'default':
            slice1Info.innerHTML = 'H1 <-> H2 <-> H3 <br>' +
                                   'Bandwidth: 10 Mbps';
            slice2Info.innerHTML = null;
            slice3Info.innerHTML = null;
            break;
        case 'slice2':
            slice1Info.innerHTML = 'H1 <-> H2 <-> H3 <br>' +
                                   'Bandwidth: 6 Mbps';
            slice2Info.innerHTML = 'H4 <-> H5 <br>' +
                                   'Bandwidth: 4 Mbps';
            slice3Info.innerHTML = null;
            break;
        case 'slice3':
            slice1Info.innerHTML = 'H1 <-> H2 <-> H3 <br>' +
            'Bandwidth: 6 Mbps';
            slice2Info.innerHTML = null;
            slice3Info.innerHTML = 'H6 <-> H7 <br>' +
                                   'Bandwidth: 4 Mbps';
            break;
        case 'both':
            slice1Info.innerHTML = 'H1 <-> H2 <-> H3 <br>' +
            'Bandwidth: 2 Mbps'
            slice2Info.innerHTML = 'H4 <-> H5 <br>' +
                                   'Bandwidth: 4 Mbps';
            slice3Info.innerHTML = 'H6 <-> H7 <br>' +
                                   'Bandwidth: 4 Mbps';
            break;
        case 'null':    
            slice1Info.innerHTML = null;
            slice2Info.innerHTML = null;
            slice3Info.innerHTML = null;
            break;
    }
}

// SLICE 2 BUTTON

activateSlice2 = () => {
    console.log('Activating Slice 2...');
    slice2Btn = document.getElementById('slice2Btn');
    slice2Btn.innerHTML = '';
    slice2Btn.classList.add("button--loading"); // toggle loading animation

    fetch('/api/activateSlice2')
    .then(response => response.json())
    .then(data => {
        if (data.success){
            console.log('Successfully activated Slice 2');
            slice2Btn.classList.remove("button--loading"); // disable loading animation
            slice2Btn.innerHTML = 'ACTIVE';
            slice2Btn.style = 'color: #51d315;';
            setSliceInfo('slice2')
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
    slice3Btn.innerHTML = '';
    slice3Btn.classList.add("button--loading"); // toggle loading animation

    fetch('/api/activateSlice3')
    .then(response => response.json())
    .then(data => {
        if (data.success){
            console.log('Successfully activated Slice 3');
            slice3Btn.classList.remove("button--loading"); // disable loading animation
            slice3Btn.innerHTML = 'ACTIVE';
            slice3Btn.style = 'color: #51d315;';
            setSliceInfo('slice3')
        }else{
            console.log('Failed to activate Slice 3');
            slice3Btn.innerHTML = 'ERROR';
            setTimeout(function(){
                slice3Btn.innerHTML = 'DISABLED';
                slice3Btn.style = 'color: #d33215;';
            }, 1000);
        } 
    });
}

activateBoth = (eventId) => {
    console.log('Activating Slice 2+3...');
    sliceBtn = document.getElementById(eventId);
    sliceBtn.innerHTML = '';
    sliceBtn.classList.add("button--loading"); // toggle loading animation

    fetch('/api/activateBoth')
    .then(response => response.json())
    .then(data => {
        if (data.success){
            console.log('Successfully activated Slice 2+3');
            sliceBtn.classList.remove("button--loading"); // disable loading animation
            sliceBtn.innerHTML = 'ACTIVE';
            sliceBtn.style = 'color: #51d315;';
            setSliceInfo('both')
        }else{
            console.log('Failed to activate Slice 2+3');
            sliceBtn.innerHTML = 'ERROR';
            setTimeout(function(){
                sliceBtn.innerHTML = 'DISABLED';
                sliceBtn.style = 'color: #d33215;';
            }, 1000);
        }
    });
}


activateSlices = (event) => {
    console.log('Slice2:' + slice2Active + " slice3: " + slice3Active)
    id = event.target.id
    if ((slice2Active && !slice3Active && id != 'slice2Btn') || (!slice2Active && slice3Active && id != 'slice3Btn')){
        // activate 2+3
        if (id === 'slice3Btn'){
            slice3Active = true;
        }else{
            slice2Active = true;
        }
        activateBoth(id);
    }else if (slice2Active && slice3Active){
        sliceBtn = document.getElementById(id);
        if (id === 'slice2Btn'){
            slice2Active = false;
            activateSlice3();
        }else{
            slice3Active = false;
            activateSlice2();
        }

        sliceBtn.innerHTML = '';
        sliceBtn.classList.add("button--loading"); // toggle loading animation
        
        setTimeout(function(){
            sliceBtn.innerHTML = 'DISABLED';
            sliceBtn.style = 'color: #d33215;';
            sliceBtn.classList.remove("button--loading"); // disable loading animation
        }, 1000);
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