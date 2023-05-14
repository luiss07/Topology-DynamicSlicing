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
    }, 2000);
}
document.getElementById("refreshBtn").addEventListener("click", refreshButton);