function ChannelSelector(){

    return(

        <div>
            
            <div class="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="switchCheckDefault"/>
                <label class="form-check-label" for="switchCheckDefault">Main_arp</label>
                </div>
                <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" />
                <label class="form-check-label" for="switchCheckChecked">Bass_line</label>
                </div>
                <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switchCheckDisabled" />
                <label class="form-check-label" for="switchCheckDisabled">Drums</label>
                </div>
                <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="switchCheckCheckedDisabled" />
                <label class="form-check-label" for="switchCheckCheckedDisabled">Drums 2</label>
                </div>

         </div>

    )
}

export default ChannelSelector;