app.component('config-tab', {
    template: 
    /*html*/
    `
    <div class="data-container" id="input-container">
						
        <div class="data-display">
            
            <div>
                <div>
                    <div class="spec-info-mini" title="Interval between queries.">?</div>
                    Data update time
                </div>
                
                <div class="data-field input-box">
                    <input type="text" id="data-update-time" readonly class="input-field" style="cursor: default;" value="5.0">
                    <div class="units time-unit">s</div>
                    <div class="updown-button-pair">
                        <button @click="increment('data-update-time')" class="updown-button">▲</button>
                        <button @click="decrement('data-update-time')" class="updown-button">▼</button>	
                    </div>
                </div>	
            </div>
            
            <div>
                <div>
                    <div class="spec-info-mini" title="Path plot point density.">?</div>
                    Plot detail level
                </div>
                
                <div class="data-field input-box">
                    <input type="text" id="line-level-detail" readonly class="input-field" style="cursor: default;" value="5">
                    <div class="units time-unit">%</div>
                    <div class="updown-button-pair">
                        <button @click="increment('line-level-detail')" class="updown-button">▲</button>
                        <button @click="decrement('line-level-detail')" class="updown-button">▼</button>	
                    </div>
                </div>	
            </div>
            
            
            <div>
                <div>
                    <div class="spec-info-mini" title="Interval for re-rendering the map canvas.">?</div>
                    Display refresh time
                </div>
                
                <div class="data-field input-box">
                    <input type="text" id="display-update-time" readonly class="input-field" style="cursor: default;" value="1.0">
                    <div class="units time-unit">s</div>
                    <div class="updown-button-pair">
                        <button @click="increment('display-update-time')" class="updown-button">▲</button>
                        <button @click="decrement('display-update-time')" class="updown-button">▼</button>	
                    </div>
                </div>	
            </div>
            
            
            
            <div v-if="source === 'https://api.wheretheiss.at/' && tracking">
                <div>
                    <div class="spec-info-mini" title="">?</div>
                    Units
                </div>
                <div class="data-field">
                    <select onchange="{updateUnits(event)}" title="units selection" style="color: rgba(255, 254, 254, 0.931); background-color: rgba(72, 96, 161, 0.475); width: 160px;"  id="units-system-field">
                        <option value="Kilometers">metric</option>
                        <option value="Miles">imperial</option>
                    </select>						
                </div>
            </div>
            
            <br>
            
        </div>
        
    </div>
    `
    ,
    props: {
        source: {
            type: String,
			required: true
        },
        tracking: {
            type: Boolean,
            required: true
        }
    }
    ,
    methods: {
        increment(id) {

            let integerInput = document.getElementById(id);
        
            const currentValue = parseInt(integerInput.value);
            if (currentValue >= 100) {return}
        
            integerInput.value = (currentValue + 1);
         
            this.updateConfigurationParameters(id, integerInput.value);
        
        },
        
        decrement(id) {
        
            let integerInput = document.getElementById(id);
        
            const currentValue = parseInt(integerInput.value);
            if (currentValue <= 1) {return}
        
            integerInput.value = (currentValue - 1).toPrecision(2);
           
            this.updateConfigurationParameters(id, integerInput.value);
        
        },

        updateConfigurationParameters(id, value){
           

            if (id === 'data-update-time')
            { 
                mountedApp.data_update_rate = value * 1000;
        
                if (value == 1) {mountedApp.loader_time = 500;}
                // Parameter to cut avoid ploting points near the satellite's figure,
                // and responsive to the selected value for the data_update_rate parameter.
                else {mountedApp.loader_time = 1000;}
            }
        
            if (id === 'display-update-time'){ 
                mountedApp.display_framerate = value * 1000; 
            }
        
            if (id === 'line-level-detail'){ 
                mountedApp.line_level_detail = value;
                updateMap([[mountedApp.object_path, mountedApp.line_level_detail]]);  
            }
        
            if (mountedApp.tracking === false) {
                return
            }
        
            mountedApp.intervals.forEach(element => {
                clearInterval(element);    
            });
        
            mountedApp.intervals.length = 0;
        
            // Restarts data collection asynchronous loop.
            const interval_UpdateData = setInterval(() => {
                
              fetchCurrentState(mountedApp.selected_satellite, mountedApp.object_path);  
          
            }, mountedApp.data_update_rate);
          
            const interval_UpdateDataDisplay = setInterval(() => {
          
              updateMap([[mountedApp.object_path, mountedApp.line_level_detail]]); 
              updateObjectPosition(mountedApp.object_path);
              updateNationalFlagPosition(mountedApp.object_path);
          
            }, mountedApp.display_framerate);
          
            mountedApp.intervals.push(interval_UpdateData, interval_UpdateDataDisplay);
        
        }


    }
})