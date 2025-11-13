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

let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

// export function SetupButtons() {

//     document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
//     document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
//     document.getElementById('process').addEventListener('click', () => {
//         Proc()
//     }
//     )
//     document.getElementById('process_play').addEventListener('click', () => {
//         if (globalEditor != null) {
//             Proc()
//             globalEditor.evaluate()
//         }
//     }
//     )
// }


// export function ProcAndPlay() {
//     if (globalEditor != null && globalEditor.repl.state.started == true) {
//         console.log(globalEditor)
//         Proc()
//         globalEditor.evaluate();
//     }
// }

// export function Proc() {

//     let proc_text = document.getElementById('proc').value
//     let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
//     ProcessText(proc_text);
//     globalEditor.setCode(proc_text_replaced)
// }

// export function ProcessText(match, ...args) {

//     let replace = ""
//     if (document.getElementById('flexRadioDefault2').checked) {
//         replace = "_"
//     }

//     return replace
// }

export default function StrudelDemo() {

    const hasRun = useRef(false);

    const tempoTimeoutRef = useRef(null)

    const [songText, setSongText] = useState(stranger_tune) 

    const [p1Enabled, setP1Enabled] = useState(true);  // true = ON, false = HUSH

    const [isPlaying, setIsPlaying] = useState(false)

    const [volume, setVolume] = useState(0.5)

    const [tempo, setTempo] = useState(140)

    const handlePlay = useCallback(() => {

        if (globalEditor){

            // Set the code
            globalEditor.setCode(songText);
        
            console.log("globalEditor methods:", globalEditor);
            console.log("Has setVolume?", typeof globalEditor.setVolume);
            console.log("repl:", globalEditor.repl);

        const codeWithTempo = songText.replace(/setcps\([^)]*\)/, `setcps(${tempo}/60/4)`);
        globalEditor.setCode(codeWithTempo);
        
        globalEditor.evaluate()

        setIsPlaying(true)

        console.log("Playing music")
    }

    },[songText, volume])


    const handleStop = useCallback(() => {

        if (globalEditor){

        globalEditor.stop()

        setIsPlaying(false)

        console.log("Stopping music")
    }
    }, [])

    const handleProcess = useCallback(() => {

        console.log("handleProcess() called, current p1Enabled:", p1Enabled);

        console.log("Preprocess clicked!");


        let processedText = songText;

        if (p1Enabled) {

            processedText = processedText.replaceAll('<p1_Radio>', '');

        } else {

            processedText = processedText.replaceAll('<p1_Radio>', '_');
        }

        

        globalEditor.setCode(processedText);


        console.log("Processed text:", processedText); 


        }, [songText, p1Enabled])

    
    const handleProcessAndPlay = useCallback(() => {

        handleProcess()
        handlePlay()

    }, [handleProcess, handlePlay])


    // Handle text changes
    const handleTextChange = useCallback((e) => {
        setSongText(e.target.value);
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

        
    // When P1 radio changes, auto process and play
    const handleP1Change = useCallback((enabled) => {

        console.log("handleP1Change triggered:", enabled);

        setP1Enabled(enabled);
        
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
    // Only attempt to change the volume if the music is currently playing
    if (isPlaying && globalEditor && typeof globalEditor.setVolume === 'function') {
        console.log(`Reactive volume change: ${volume}`);
        globalEditor.setVolume(volume);
    }
}, [volume, isPlaying]); // Now depends on volume AND isPlaying


useEffect(() => {
    if (isPlaying && globalEditor) {

        tempoTimeoutRef.current = setTimeout(() => {

            console.log(`Reactive tempo change: ${tempo}`);
            // Re-evaluate with new tempo
            const codeWithTempo = songText.replace(/setcps\([^)]*\)/, `setcps(${tempo}/60/4)`);
            globalEditor.setCode(codeWithTempo);
            globalEditor.evaluate();
        }, 300)

        return () => {
            if (tempoTimeoutRef.current) {
                clearTimeout(tempoTimeoutRef.current);
            }
        };
    }
}, [tempo, isPlaying, songText]);


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
                    <ControlButtons onPlay={handlePlay} onStop={handleStop} onProcess={handleProcess} onProcessAndPlay={handleProcessAndPlay}/>
                    <br/>
                    <VolumeControl volume={volume} updateVolume={updateVolume}/>
                    <PreprocessorControls p1Enabled={p1Enabled} onP1Change={handleP1Change}/>
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