function ControlButtons( { onPlay, onStop, onProcess, onProcessAndPlay }){

    console.log("ControlButtons rendered");

    return (
        <nav>
            <div className="row"> 
                <div className="d-flex gap-2">
                    <button id="play" className="btn btn-primary flex-fill" onClick={onPlay} style={{ padding: '15px', fontSize: '1.1rem' }}>Play</button>
                <button id="stop" className="btn btn-primary flex-fill"onClick={onStop} style={{ padding: '15px', fontSize: '1.1rem' }}>Stop</button>
                </div>

            </div>

        </nav>
        

    );
}

export default ControlButtons;