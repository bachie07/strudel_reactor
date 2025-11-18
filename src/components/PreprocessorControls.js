function PreprocessorControls({ channelsEnabled,  onChannelChange}){


    return (

        
            <div className="row g-2">

            <div className="col-6">
            <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault" 
            checked={channelsEnabled.main_arp} onChange={(e) => onChannelChange('main_arp', e.target.checked)}/>
            <label className="form-check-label" htmlFor="switchCheckDefault">Main_arp</label>

            </div>

            <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" 
            checked={channelsEnabled.bassline} onChange={(e) => onChannelChange('bassline', e.target.checked)}/>
                      
            <label className="form-check-label"  htmlFor="switchCheckChecked">Bass_line</label>
            </div>
            </div>

            <div className="col-6">

            <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="switchCheckDisabled" 
            checked={channelsEnabled.drums} onChange={(e) => onChannelChange('drums', e.target.checked)}/>

            <label className="form-check-label"  htmlFor="switchCheckDisabled">Drums</label>
            </div>
            <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="switchCheckCheckedDisabled"
            checked={channelsEnabled.drums2} onChange={(e) => onChannelChange('drums2', e.target.checked)}/>
                   
            <label className="form-check-label" htmlFor="switchCheckCheckedDisabled">Drums 2</label>
            </div>
            </div>

            </div>
    );
}

export default PreprocessorControls;