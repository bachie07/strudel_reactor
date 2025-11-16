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
import ChannelSelector from './components/ChannelSelector';
import TempoSelector from './components/TempoSelector';
import VolumeControl from './components/VolumeControl';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import { preprocessSong } from './utils/PreprocessLogic';

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};


export default function StrudelDemo() {

    const hasRun = useRef(false); 

    const tempoTimeoutRef = useRef(null) // useRef storing timeout session

    const [songText, setSongText] = useState(stranger_tune) 

     //channelsEnabled object storing state of each instrument
    const [channelsEnabled, setChannelsEnabled] = useState({
            bassline: true,
            main_arp: true,
            drums: true,
            drums2: true
        });

    const [isPlaying, setIsPlaying] = useState(false)

    const [volume, setVolume] = useState(1.0) 

    const [tempo, setTempo] = useState(140)




    const handlePlay = useCallback(() => {

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


    const handleStop = useCallback(() => {

        if (globalEditor){

        globalEditor.stop()

        setIsPlaying(false)

        console.log("Stopping music")
    }
    }, [])

    

    // Handle text changes
    const handleTextChange = useCallback((e) => {
        const newText = setSongText(e.target.value);
    
        if (globalEditor) {
            globalEditor.setCode(newText);
        }
    }, []);



    const updateVolume = useCallback((e) => {

        const newVolume = parseFloat(e.target.value);
        console.log("Volume slider moved to:", newVolume); // Add this log
        setVolume(newVolume)

    }, [])

    const updateTempo = useCallback((e) => {

        const newTempo = parseFloat(e.target.value);
        setTempo(newTempo);

    })


    const handleChannelChange = useCallback((channelName, enabled) => { // change instrument state to true to onChange called 
        setChannelsEnabled(prev => ({
            ...prev,
            [channelName]: enabled
        }));
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


return (
    <div>
        <main>
            <div className="container-fluid">
                <header className="text-center mb-6" style={{marginTop: 20}}>
                    <h2>Strudel Demo</h2>
                </header>

                <div className="row">
                <div className="col-md-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                    <ProcessTextArea textValue={songText} onTextChange={handleTextChange}/>
                    </div>

                    <div className="col-md-6" style={{ maxHeight: '50vh', overflowY: 'auto', marginTop: 30, marginBottom: 50 }}> 
                        <div id="editor" />
                        <div id="output" />
                    </div>
                   
                </div>
                <div className="row">
                    <div className="col-md-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                    <ControlButtons onPlay={handlePlay} onStop={handleStop}/>
                    <br/>
                    <VolumeControl volume={volume} updateVolume={updateVolume}/>
                    <PreprocessorControls   channelsEnabled={channelsEnabled}  onChannelChange={handleChannelChange}/>
                    <TempoSelector tempo={tempo} updateTempo={updateTempo}/>
                    <ChannelSelector/>

                    </div>
                </div>
            </div>
            <canvas id="roll"></canvas>
        </main >
    </div >
);

}