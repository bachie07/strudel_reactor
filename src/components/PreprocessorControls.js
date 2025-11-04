function PreprocessorControls(){
 // onChange={ProcAndPlay} defaultChecked  ->(for ON) input
 // onChange={ProcAndPlay} (for HUSH) -> input
    return (

        <div className="col-md-4">
        <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"  /> 
            <label className="form-check-label" htmlFor="flexRadioDefault1">
                p1: ON
            </label>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"  />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
                p1: HUSH
            </label>
        </div>
    </div>

    )
}

export default PreprocessorControls;