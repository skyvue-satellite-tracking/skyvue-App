app.component('source-tab', {
    template:
    /*html*/
    `
    <div class="data-container" id="source-container">

        <div class="source-selector">

            <div id="source-display" style="padding: 0 15px ">
                
                <div>Satellite selection:</div>

                <div class="source-field">
                    
                    <input style="color: #ffc431;" @keyup.enter="enterSatellite()" @click="$event.target.value = ''" type="text" class="" v-model="norad_number"/>

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
                <p id="examples-text">Examples</p>
                <div class="source-example-row">
                    <div class="source-example-header">NAME</div>
                    <div class="source-example-header">NORAD</div>
                </div>
                <div class="source-example-row">
                    <div class="source-example-field">ISS - International Space Station</div>
                    <div class="source-example-field-value">25544</div>
                </div>
                <div class="source-example-row">
                    <div class="source-example-field">GLAST - Fermi Gamma-ray Space Telescope</div>
                    <div class="source-example-field-value">33053</div>
                </div>
                <div class="source-example-row">
                    <div class="source-example-field">STARLINK 1020</div>
                    <div class="source-example-field-value">44725</div>
                </div>
            </div>
        </div>
        
        <div v-if="!tracking" class="button-box">
            <button @click="startTracking(norad_number)" class="button">
                <img alt="Start Tracking button." src="./assets/start_tracking.png" width="30px">
                START TRACKING
            </button>
        </div>
        
        <div v-if="tracking" class="button-box">
            <button @click="stopTracking()" class="button">
                <img alt="Stop tracking button." src="./assets/stop_tracking.png" width="30px">
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

            (window.innerWidth < 1250) ? document.getElementById('main-window').scrollIntoView() : '';
        
            this.stopTracking();

            document.getElementById('chatbot-response').textContent = '';
            
            function isNumeric(str) {
                return /^[0-9]+(\.[0-9]+)?$/.test(str);
            }
            
            if( isNumeric(norad_number) ) {
            
                mountedApp.resetInterface();

                fetchCurrentState(norad_number, mountedApp.object_path);  
          
                // Starts data collection asynchronous loop.
                const interval_UpdateData = setInterval(() => {
              
                  fetchCurrentState(norad_number, mountedApp.object_path);  
              
                }, mountedApp.data_update_rate);
              
                // Starts representing data on the view tabs.
                const interval_UpdateDataDisplay = setInterval(() => {
    
                    if (mountedApp.object_path.length === 0) {
                        return
                    }

                    updateMap([
                        [mountedApp.predicted_path, 100]
                    ]);
                        
                    updateObjectPosition(mountedApp.object_path);
                                         
                   

              
                }, mountedApp.display_framerate);
              
                mountedApp.intervals.push(interval_UpdateData, interval_UpdateDataDisplay);
                
                setTimeout(() => {
                    mountedApp.tracking = true;
                }, 100);
                
            }
            else {
                activityLogging("🙄 Invalid input.")
            }
          
            
        },        

        stopTracking(){
        
            //Reseting variables, intervals and timeouts. 

            let canvas_ctx = document.getElementById('canvas2D').getContext('2d');
            canvas_ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);
            
            mountedApp.tracking = false; 
            
            mountedApp.timeouts.forEach(elementID => { 
                clearTimeout(elementID);    
            });

            mountedApp.intervals.forEach(elementID => { 
                clearInterval(elementID);    
            });
            

        },

        enterSatellite() {
            this.stopTracking(); 
            setTimeout(() => {this.startTracking(mountedApp.selected_satellite)}, 300);
        }

    },
    updated() {
        mountedApp.selected_satellite = this.norad_number;
    }
})