import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function VoiceNoteRecorder({ onRecordingComplete, existingNoteUrl }) {
    const isPlaybackOnlyMode = !!existingNoteUrl && !onRecordingComplete;
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(existingNoteUrl || null);
    const [uploading, setUploading] = useState(false);
    
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const [volume, setVolume] = useState(0);

    const CLOUD_NAME = "dxw4nx5to"; 
    const UPLOAD_PRESET = "agri_crm_preset";

    useEffect(() => { setAudioURL(existingNoteUrl); }, [existingNoteUrl]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // --- Visualizer Logic (Aawaz check karne ke liye) ---
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            source.connect(analyserRef.current);
            
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            const updateVolume = () => {
                if (!analyserRef.current) return;
                analyserRef.current.getByteFrequencyData(dataArray);
                const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setVolume(avg); // Ye volume state bar ko hilayegi
                requestAnimationFrame(updateVolume);
            };
            updateVolume();

            // --- Recording Logic ---
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                
                setUploading(true);
                const formData = new FormData();
                formData.append('file', audioBlob);
                formData.append('upload_preset', UPLOAD_PRESET);
                try {
                    const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, formData);
                    if (onRecordingComplete) onRecordingComplete(res.data.secure_url);
                } catch (err) { console.error(err); }
                setUploading(false);
                if (audioContextRef.current) audioContextRef.current.close();
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) { alert("Mic not found or access denied!"); }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    };

    return (
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '10px', background: '#fff' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>🎙️ Voice System</label>
            
            {/* Audio Player */}
            {audioURL && <audio key={audioURL} src={audioURL} controls style={{ width: '100%', marginBottom: '10px' }} crossOrigin="anonymous" />}

            {/* Visualizer Bar (Aawaz checking tool) */}
            {isRecording && (
                <div style={{ background: '#eee', height: '10px', width: '100%', borderRadius: '5px', marginBottom: '10px', overflow: 'hidden' }}>
                    <div style={{ background: '#007bff', height: '100%', width: `${Math.min(volume * 2, 100)}%`, transition: 'width 0.1s' }}></div>
                </div>
            )}

            {!isPlaybackOnlyMode && (
                <div>
                    {!isRecording ? 
                        <button type="button" onClick={startRecording} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🎤 Start Recording</button> :
                        <button type="button" onClick={stopRecording} style={{ padding: '10px 20px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>⏹️ Stop & Save</button>
                    }
                    {uploading && <span style={{ marginLeft: '10px' }}>Uploading...</span>}
                </div>
            )}
        </div>
    );
}

export default VoiceNoteRecorder;