app.component('data-tab', {
    template:
    /*html*/
    `
    <div class="data-container" id="output-container">
						
        <div class="data-display">
            
            <div>
                <div>Latitude</div>
                <div class="data-field">
                    <output style="cursor: default;" id="latitude" readonly value="0"></output> 
                    <div class="units coordinates-unit">deg</div>
                </div>
            </div>
            
            <div>
                <div>Longitude</div>
                <div class="data-field">
                    <output style="cursor: default;" id="longitude" readonly class="" value="0"></output> 
                    <div class="units coordinates-unit">deg</div>
                </div>
            </div>
            
            <div>
                <div>Altitude</div>
                <div class="data-field">
                    <output style="cursor: default;" id="altitude" readonly class="" value="0"></output> 
                    <div class="units distance-unit">Km</div>
                </div>
            </div>
            
            <div>
                <div>Velocity</div>
                <div class="data-field">
                    <output style="cursor: default;" id="velocity" readonly class="" value="0"></output> 
                    <div class="units velocity-unit">Km/h</div>
                </div>
            </div>
            
            <div>
                <div>Solar Latitude</div>
                <div class="data-field">
                    <output style="cursor: default;" id="solarlatitude" readonly class="" value="0"></output> 	
                    <div class="units coordinates-unit">deg</div>
                </div>
            </div>
            
            <div>
                <div>Solar Longitude</div>
                <div class="data-field">
                    <output style="cursor: default;" id="solarlongitude" readonly class="" value="0"></output> 	
                    <div class="units coordinates-unit">deg</div>
                </div>
            </div>
            
            <div>
                <div>
                    <div class="spec-info-mini" title="The visibility of a satellite depends on its altitude. It determines the area from which the satellite is visible from an Earth station.">?</div>
                    Visibility
                </div>
                <div class="data-field">
                    <output style="cursor: default;" id="visibility" readonly class="" value="0"></output> 	
                    <div class="units">&nbsp;</div>
                </div>
            </div>
            
            <div>
                <div>
                    <div class="spec-info-mini" title="The footprint of a communications satellite is the ground area that its transponders offer coverage, and determines the satellite dish diameter required to receive each transponder's signal.">?</div>
                    Footprint
                </div>
                <div class="data-field">
                    <output style="cursor: default;" id="footprint" readonly class="" value="0"></output> 	
                    <div class="units distance-unit">Km</div>
                </div>
            </div>
            
            <br>
            
        </div>
        
        <div class="button-box">
            <button @click="openDataManager()" class="button"><img src="./assets/data.png" width="30px">DATA MANAGER</button>
        </div>
        
    </div>
    `
    ,
    props: {
        object_path: {
            type: Array,
            required: true
        }
    },
    computed: {

        path_length () {
            return this.object_path.length;
        }

    },
    methods: {
        openDataManager(){
            document.getElementById('data-manager-container').style.display = 'flex';
        }
    },
    watch: {
        path_length(new_value, old_value){

            // current_state object structure:
            // {
            //   'name':  name,F
            //   'id': id,
            //   'latitude': latitude,
            //   'longitude': longitude,
            //   'velocity': velocity,
            //   'visibility': visibility,
            //   'footprint': footprint,
            //   'time': time,
            //   'daynum': daynum,
            //   'solarlatitude': solar_lat,
            //   'solarlongitude': solar_lon,
            //   'units': units
            // }

            object_path = mountedApp.object_path;
            length = object_path.length;
            if (length > 0) {
                current_state = object_path[length - 1];        
                Object.keys(current_state).forEach(key => {
                    
                    data_field_element = document.getElementById(key);
                    value = current_state[key];
                
                    if ((value != undefined) && (data_field_element != undefined)){
                        data_field_element.textContent = value;
                    }
                    
                    if ((value === undefined) && (data_field_element != undefined)){
                        data_field_element.textContent = '-';
                    }    
                });
            }
        
        }
    }
})