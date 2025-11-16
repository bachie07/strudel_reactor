function TempoSelector( {tempo, updateTempo}){

    return(

        <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">setCPM</span>
        <input type="range" className="form-range" min="60" max="200" step="10" id="volume_range" value={tempo} onChange={updateTempo}/>

        </div> 
    )
}

export default TempoSelector;