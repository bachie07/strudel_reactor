function VolumeControl({volume, updateVolume}) {

    return(
        <div>
        <label htmlFor="volume_range" className="form-label">Volume</label>
        <input type="range" className="form-range" min="0.0" max="2.0" step="0.01" id="volume_range" value={volume} onChange={updateVolume}/>
        </div>
    )
}

export default VolumeControl; 