function ControlButtons( { onPlay, onStop, onProcess, onProcessAndPlay }){

    console.log("ControlButtons rendered");

    return (
        <nav>
            <div className="row"> 
                <div className="col-auto">
                    <button id="play" className="btn btn-outline-primary" onClick={onPlay}>Play</button>
                </div>
                <div className="col-auto">
                <button id="stop" className="btn btn-outline-danger" onClick={onStop}>Stop</button>
                </div>

            </div>

        </nav>
        

    );
}

export default ControlButtons;