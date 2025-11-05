function VolumeControl({volume, updateVolume}) {

    return(
        <div>
        <label htmlFor="volume_range" className="form-label">Volume</label>
        <input type="range" className="form-range" min="0" max="1" step="0.1" id="volume_range" value={volume} onChange={updateVolume}/>
        </div>
    )
}

export default VolumeControl; 