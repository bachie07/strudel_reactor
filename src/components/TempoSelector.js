function TempoSelector( {tempo, updateTempo}){

    return (
        <div className="input-group mb-3" style={{marginTop: '30px'}}>
            <span className="input-group-text" id="basic-addon1">BPM</span>
            <input 
                type="number"   
                className="form-control"  
                min="60" 
                max="200" 
                step="5" 
                value={tempo} 
                onChange={updateTempo}
            />
        </div> 
    );
}


export default TempoSelector;