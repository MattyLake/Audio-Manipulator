import './index.css';

import * as d3 from 'd3';
import { Howl } from 'howler';

// Get DOM elements
const audioFile = document.getElementById('audioFile');
const playButton = document.getElementById('playButton');
const svg = d3.select("#waveform");

// SVG dimensions
const svgWidth = +svg.attr("width") || 800; // Fallback for dynamic sizing
const svgHeight = +svg.attr("height") || 200; // Fallback for dynamic sizing

// Global variables for audio state and visualization
let howl = null;
let animationFrameId = null;
let playbackLine = null;
let xScale = null;
let waveformData = null;
let duration = 0;

// Function to draw the waveform on the SVG
function drawWaveform(data) {
    // Clear previous drawing
    svg.selectAll("*").remove();

    // Summarize data to fit the SVG width for better performance
    // and a cleaner visualization. We take the max amplitude for each pixel column.
    const sampleRate = data.length / svgWidth;
    waveformData = [];
    for (let i = 0; i < svgWidth; i++) {
        let max = 0;
        let min = 0;
        const start = Math.floor(i * sampleRate);
        const end = Math.min(data.length, start + sampleRate);
        for (let j = start; j < end; j++) {
            const value = data[j];
            if (value > max) max = value;
            if (value < min) min = value;
        }
        waveformData.push({ max, min });
    }
    
    // Create scales to map data values to SVG coordinates
    xScale = d3.scaleLinear()
        .domain([0, waveformData.length - 1])
        .range([0, svgWidth]);

    const yScale = d3.scaleLinear()
        .domain([-1, 1]) // Audio sample values are typically between -1 and 1
        .range([svgHeight, 0]);

    // D3 area generator to create the path for the waveform
    const area = d3.area()
        .x((d, i) => xScale(i))
        .y0(d => yScale(d.min))
        .y1(d => yScale(d.max));

    // Append the waveform path to the SVG
    svg.append("path")
        .datum(waveformData)
        .attr("fill", "steelblue")
        .attr("d", area);

    // Create the vertical line that will follow the playback
    playbackLine = svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", svgHeight)
        .attr("stroke", "red")
        .attr("stroke-width", 2);
}

// Function to update the playback line's position
function updatePlaybackLine() {
    if (howl && howl.playing()) {
        const seek = howl.seek() || 0; // Get current playback position in seconds
        const currentX = (seek / duration) * svgWidth; // Map time to x-coordinate
        playbackLine.attr("x1", currentX).attr("x2", currentX);
    }
    animationFrameId = requestAnimationFrame(updatePlaybackLine);
}

// Event listener for the file input
audioFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset state and button
    if (howl) howl.unload();
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    playButton.textContent = "Loading...";
    playButton.disabled = true;

    const reader = new FileReader();
    reader.onload = function(event) {
        // Create a Blob from the ArrayBuffer and a URL for Howler.js
        const audioBlob = new Blob([event.target.result], { type: file.type });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Decode the audio data for visualization
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result.slice(0), (buffer) => {
            duration = buffer.duration;
            const channelData = buffer.getChannelData(0);
            drawWaveform(channelData);

            // Create a new Howl instance with the audio URL
            howl = new Howl({
                src: [audioUrl],
                html5: true, // Use HTML5 Audio for streaming large files
                format: [file.name.split('.').pop()],
                onload: () => {
                    playButton.textContent = "Play";
                    playButton.disabled = false;
                    playbackLine.attr("x1", 0).attr("x2", 0); // Reset line position
                },
                onend: () => {
                    playButton.textContent = "Play";
                    cancelAnimationFrame(animationFrameId);
                    playbackLine.attr("x1", 0).attr("x2", 0); // Reset line on end
                }
            });
        }, (e) => console.error("Error with decoding audio data:", e));
    };
    reader.readAsArrayBuffer(file);
});

// Event listener for the play/pause button
playButton.addEventListener('click', () => {
    if (!howl) return;

    if (howl.playing()) {
        howl.pause();
        playButton.textContent = "Play";
        cancelAnimationFrame(animationFrameId);
    } else {
        howl.play();
        playButton.textContent = "Pause";
        // Start the animation loop for the playback line
        animationFrameId = requestAnimationFrame(updatePlaybackLine);
    }
});