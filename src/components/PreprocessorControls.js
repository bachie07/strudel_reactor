function PreprocessorControls({ p1Enabled, onP1Change }){
 // onChange={ProcAndPlay} defaultChecked  ->(for ON) input
 // onChange={ProcAndPlay} (for HUSH) -> input
    return (

        <div className="col-md-4">
        <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={p1Enabled === true} onChange={() => {   console.log("Radio clicked -> p1Enabled:", true);
onP1Change(true)} }/> 
            <label className="form-check-label" htmlFor="flexRadioDefault1">
                p1: ON
            </label>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={p1Enabled === false} onChange={() => onP1Change(false)} />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
                p1: HUSH
            </label>
        </div>
        <br></br>


            </div>

    );
}

export default PreprocessorControls;