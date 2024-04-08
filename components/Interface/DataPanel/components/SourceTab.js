app.component('source-tab', {
    template:
    /*html*/
    `
    <div class="data-container" id="source-container">

        <div class="source-selector">

            <div id="source-display" style="padding: 0 15px ">
                
                <div>Satellite selection:</div>

                <div class="source-field">
                    
                    <input @keyup.enter="startTracking(norad_number)" @click="$event.target.value = ''" type="text" class="" v-model="norad_number"/>

                </div>
                <div class="spec">
                    <div style="display: inline-flex; gap: 5px;">
                        <div class="source-spec-info" title="The NORAD Catalog Number, also known as the SATCAT, is a nine-digit sequential identifier assigned by the United States Space Command (USSPACECOM) to all artificial objects in Earth’s orbit and those that have left Earth’s orbit. It represents the order of launch or discovery and is used to track satellites and other space objects.">?</div>	
                        <a class="source-spec-name" target="_blank"href=" https://celestrak.org/NORAD/elements/table.php?GROUP=active">NORAD catalog</a>	
                    </div>
                </div>
                
            </div>
            
        </div>

        <div class="data-display">
            <div class="source-examples-table">
                <p style="font-size:1.7vh; padding:0; font-weight:100">Examples</p>
                <div class="source-example-row">
                    <div class="source-example-header">NAME</div>
                    <div class="source-example-header">NORAD</div>
                </div>
                <div class="source-example-row">
                    <div class="source-example-field">ISS - International Space Station</div>
                    <div class="source-example-field">25544</div>
                </div>
                <div class="source-example-row">
                    <div class="source-example-field">GLAST - Fermi Gamma-ray Space Telescope</div>
                    <div class="source-example-field">33053</div>
                </div>
                <div class="source-example-row">
                    <div class="source-example-field">STARLINK 1020</div>
                    <div class="source-example-field">44725</div>
                </div>
            </div>
        </div>
        
        <div v-if="!tracking" class="button-box">
            <button @click="startTracking(norad_number)" class="button">
                <img src="./assets/start_tracking.png" width="30px">
                START TRACKING
            </button>
        </div>
        
        <div v-if="tracking" class="button-box">
            <button @click="stopTracking()" class="button">
                <img src="./assets/stop_tracking.png" width="30px">
                STOP TRACKING
            </button>
        </div>
        
    </div>
    `
    ,
    data() {
        return {
            norad_number: 'Enter NORAD number'
        }
    },
    props: {
        tracking: {
            type: Boolean,
            required: true
        },
    },
    methods: {
        
        startTracking(norad_number){
            
            function isNumeric(str) {
                return /^[0-9]+(\.[0-9]+)?$/.test(str);
            }
            
            if( isNumeric(norad_number) ) {
            
                mountedApp.resetInterface();

                fetchCurrentState(norad_number, mountedApp.object_path);  
                fecthPredictedPath(norad_number, mountedApp.predicted_path)
          
                // Starts data collection asynchronous loop.
                const interval_UpdateData = setInterval(() => {
              
                  fetchCurrentState(norad_number, mountedApp.object_path);  
              
                }, mountedApp.data_update_rate);
              
                // Starts representing data on the view tabs.
                const interval_UpdateDataDisplay = setInterval(() => {
    
                  updateMap([[mountedApp.object_path, mountedApp.line_level_detail]]); 
                  updateObjectPosition(mountedApp.object_path);
                  updateNationalFlagPosition(mountedApp.object_path);
              
                }, mountedApp.display_framerate);
              
                mountedApp.intervals.push(interval_UpdateData, interval_UpdateDataDisplay);
                mountedApp.tracking = true;

                
                
            }
            else {
                activityLogging("🙄 Invalid input.")
            }
          
            
        },        

        stopTracking( ){
        
            //Reseting intervals and timeouts. 
            
            mountedApp.timeouts.forEach(elementID => { 
                clearTimeout(elementID);    
            });

            mountedApp.intervals.forEach(elementID => { 
                clearInterval(elementID);    
            });
            mountedApp.tracking = false; 

        }

    },
    updated() {
        mountedApp.selected_satellite = this.norad_number;
    }
})