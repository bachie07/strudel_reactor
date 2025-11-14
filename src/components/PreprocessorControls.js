function PreprocessorControls({ p1Enabled, onP1Change }){
 // onChange={ProcAndPlay} defaultChecked  ->(for ON) input
 // onChange={ProcAndPlay} (for HUSH) -> input
    return (

        <div>
            <br></br>
            <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" checked/>
            <label className="form-check-label" htmlFor="switchCheckDefault">Main_arp</label>
            </div>
            <div class="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" checked/>
            <label className="form-check-label"  htmlFor="switchCheckChecked">Bass_line</label>
            </div>
            <div class="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="switchCheckDisabled" checked/>
            <label className="form-check-label"  htmlFor="switchCheckDisabled">Drums</label>
            </div>
            <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="switchCheckCheckedDisabled" checked/>
            <label className="form-check-label" htmlFor="switchCheckCheckedDisabled">Drums 2</label>
            </div>

            </div>

    );
}

export default PreprocessorControls;