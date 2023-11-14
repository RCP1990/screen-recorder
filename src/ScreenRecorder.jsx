import { useState, useEffect } from 'react'
import './App.css'

function ScreenRecorder() {
  const [RECORDING_ONGOING, setRecording] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false);

  var blob = null;
  let deviceRecorder, chunks = [];

  useEffect(() => {
    if (RECORDING_ONGOING) {
      startRecording(); // Start the recording
    }
    else { 
      stopRecording(); // Stop screen recording
    }
    
      return () => {
        // Perform cleanup if needed
        stopRecording();
      };
    }, [RECORDING_ONGOING]);

    async function startRecording() {
      var stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true,
      });
  
      deviceRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  
      deviceRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      deviceRecorder.onstop = () => {
        chunks = [];
        setShowPrompt(true); // Show prompt when recording stops
      };
      deviceRecorder.start(250);
    }

    function stopRecording() {
      if (deviceRecorder && deviceRecorder.state === 'recording') {
        deviceRecorder.stop();
      }
    }
  
    function handlePrompt() {
      setShowPrompt(false); // Reset showPrompt state
      var filename = window.prompt('File name', 'video');
      if (filename) {
        blob = new Blob(chunks, { type: 'video/video/mp4' });
        chunks = [];
        var dataDownloadUrl = URL.createObjectURL(blob);
  
        // Downloading it onto the user's device
        let a = document.createElement('a');
        a.href = dataDownloadUrl;
        a.download = `${filename}.webm`;
        a.click();
  
        URL.revokeObjectURL(dataDownloadUrl);
      }
    }

  return (
    <>
      <div className="card">
        <button id="recording-toggle" onClick={() => setRecording(!RECORDING_ONGOING)}>{RECORDING_ONGOING ? 'Stop Recording' : 'Start Recording' }</button>
      </div>
    </>
  )
}

export default ScreenRecorder
