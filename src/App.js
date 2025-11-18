import './App.css';
import { useCallback, useEffect, useRef, useState} from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { e, evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import PreprocessorControls from './components/PreprocessorControls';
import ControlButtons from  './components/ControlButtons';
import ProcessTextArea from './components/ProcessTextArea';
import TempoSelector from './components/TempoSelector';
import VolumeControl from './components/VolumeControl';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import { preprocessSong } from './utils/PreprocessLogic';
import SaveLoadControls from './components/SaveLoadControls';
import D3GraphVisualizer from './components/D3Visualiser';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};


export default function StrudelDemo() {

    const hasRun = useRef(false); 

    const tempoTimeoutRef = useRef(null) // useRef storing timeout session

    const [songText, setSongText] = useState(stranger_tune)  //storing song text state


    //channelsEnabled object storing state of each instrument
    const [channelsEnabled, setChannelsEnabled] = useState({
            bassline: true,
            main_arp: true,
            drums: true,
            drums2: true
        });

    const [isPlaying, setIsPlaying] = useState(false)  // control isPlaying state

    const [volume, setVolume] = useState(1.0) //controlling volumne state

    const [tempo, setTempo] = useState(140) // controlling tempo state



    // pass as porps to Controll buttons component
    const handlePlay = useCallback(() => {  // useCallback prevents recreating function on every render

        if (globalEditor){

            const processedCode = preprocessSong(songText, {
                channelsEnabled,
                tempo,
                volume
            });

            // Set the code
            globalEditor.setCode(processedCode);
        
            console.log("globalEditor methods:", globalEditor);
            console.log("Has setVolume?", typeof globalEditor.setVolume);
            console.log("repl:", globalEditor.repl);

            globalEditor.evaluate()

            setIsPlaying(true)

            console.log("Playing music")

    }

    },[songText, channelsEnabled, tempo, volume])

    // pass as props to ControlButtons component
    const handleStop = useCallback(() => {

        if (globalEditor){

        globalEditor.stop()

        setIsPlaying(false)

        console.log("Stopping music")
    }
    }, [])

    

    // Handle text changes
    const handleTextChange = (e) => {
        const newText = setSongText(e.target.value);
    
        if (globalEditor) {
            globalEditor.setCode(newText);
        }
    };


    // pass as prop to volume control component
    const updateVolume = useCallback((e) => {

        const newVolume = parseFloat(e.target.value);
        console.log("Volume slider moved to:", newVolume); // Add this log
        setVolume(newVolume)

    }, [])

    // pass as prop to tempo control component
    const updateTempo = useCallback((e) => {

        const newTempo = parseFloat(e.target.value);
        setTempo(newTempo);

    })


    // pass as prop to PreprocessrControl component
    const handleChannelChange = useCallback((channelName, enabled) => { // change instrument state to true to onChange called 
        setChannelsEnabled(prev => ({
            ...prev,
            [channelName]: enabled
        }));
    }, []);


    // storing current settings for saving json 
    const currentSettings = {
        volume,
        tempo,
        channelsEnabled,
        songText,
        timestamp: new Date().toISOString()
    };

    //pass as props to SaveLoadControls component
    const handleLoadSettings = useCallback((loadedSettings) => { // update all states with the loaded settings gile
        if (loadedSettings.volume !== undefined) setVolume(loadedSettings.volume);
        if (loadedSettings.tempo !== undefined) setTempo(loadedSettings.tempo);
        if (loadedSettings.channelsEnabled) setChannelsEnabled(loadedSettings.channelsEnabled);
        if (loadedSettings.songText) setSongText(loadedSettings.songText);
        
        console.log("Settings loaded successfully!");
    }, []);





useEffect(() => {

    if (!hasRun.current) {
        document.addEventListener("d3Data", handleD3Data);
        console_monkey_patch();
        hasRun.current = true;
        //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
            
    }

}, []);


useEffect(() => {
    if (isPlaying && globalEditor) {

        tempoTimeoutRef.current = setTimeout(() => { // use setTimeOut to manage delay when play

            console.log(`Reactive tempo change: ${tempo}`);
            // Re-evaluate with new tempo
            const processedCode = preprocessSong(songText, {
                channelsEnabled,
                tempo,
                volume
            });

            globalEditor.setCode(processedCode);
            globalEditor.evaluate();
        }, 300)

        return () => {
            if (tempoTimeoutRef.current) { // clear current ref 
                clearTimeout(tempoTimeoutRef.current);
            }
        };
    }
}, [tempo, isPlaying, songText, channelsEnabled, volume]); // only called when dependancies change 


//container return each section
return (
    <div className="app-container">
        <main>
            <div className="container-fluid main-container">
                <header className="app-header">
                    <h2>Strudel Reactor</h2>
                </header>
                
                <div className="row g-3 main-row">
                    
                    {/* Controls & D3 */}
                    <div className="col-lg-6 left-column">
                        {/* Controls Section */}
                        <div className="control-panel p-3 mb-3">
                            <h5>Controls</h5>
                            
                          
                            <ControlButtons onPlay={handlePlay} onStop={handleStop}/>          
                   
                            <div className="row mt-3 g-2">
                                <div className="col-6">
                                    <VolumeControl volume={volume} updateVolume={updateVolume}/>
                                </div>
                                <div className="col-6">
                                    <TempoSelector tempo={tempo} updateTempo={updateTempo}/>
                                </div>
                            </div>

                            <div className="mt-3">
                                <h6 style={{color: '#00d4ff', marginBottom: '10px'}}>Channels</h6>
                                <PreprocessorControls 
                                    channelsEnabled={channelsEnabled} 
                                    onChannelChange={handleChannelChange}
                                />
                            </div>
                        
                            <SaveLoadControls 
                                currentSettings={currentSettings}
                                onLoadSettings={handleLoadSettings}
                            />
                        </div>

                        {/* D3 Visualization */}
                        <div className="d3-wrapper">
                            <D3GraphVisualizer />
                        </div>
                    </div>

                    {/* Code Editors */}
                    <div className="col-lg-6 right-column">
                        {/* Textarea */}
                        <div className="textarea-section">
                            <h5 className="section-header">Text to preprocess</h5>
                            <div className="textarea-wrapper">
                                <ProcessTextArea 
                                    textValue={songText} 
                                    onTextChange={handleTextChange}
                                />
                            </div>
                        </div>

                        {/* Strudel Editor */}
                        <div className="editor-section">
                            <h5 className="section-header">Live Editor</h5>
                            <div id="editor"></div>
                        </div>
                    </div>
                </div>

                {/* Piano Roll */}
                <div className="hidden-canvas">
                    <canvas id="roll"></canvas>
                </div>
            </div>
        </main>
    </div>
);
}