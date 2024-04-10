app.component('view-panel', {
    template:
    /*html*/
    `
    <div id ="main-window">
					
        <div id="view-tabs">
            <div @click="selectTab($event.target)" class="tab" id="specs-tab">SPECS</div>
            <div @click="selectTab($event.target)" class="tab" id="map2D-tab">2D VIEW</div>
            <div @click="selectTab($event.target)" class="tab" id="map3D-tab">3D VIEW</div>
            <div @click="selectTab($event.target)" class="tab" id="altitude-tab">PLANETARIUM</div>
            <div @click="selectTab($event.target)" class="tab" id="statistics-tab">STATISTICS</div>
            <div @click="selectTab($event.target)" class="tab" id="forecast-tab">FORECAST</div>
        </div>
        
        <output id="time" readonly value="" :style="[viewer_state === 'map2D' ? { 'opacity': '1' } : { 'opacity': '0' }]"></output>
        
        <div id="screen" >
        
            <specs-tab  v-show="viewer_state === 'specs'" :tracking="tracking" :selected_satellite="selected_satellite" :tle_string="tle_string" ></specs-tab>
            <map2D-tab  v-show="viewer_state === 'map2D'" :tracking="tracking" :object_path="object_path"></map2D-tab>
            <map3D-tab  v-show="viewer_state === 'map3D'"></map3D-tab>
            <altitude-tab  v-show="viewer_state === 'altitude'"></altitude-tab>
            <statistics-tab  v-show="viewer_state === 'statistics'"></statistics-tab>
            <forecast-tab  v-show="viewer_state === 'forecast'"></forecast-tab>

        </div>
                
        <div id="view-labels">
            <view-label v-for="label in map2D_labels" :label="label" :style="[viewer_state === 'map2D' ? { 'opacity': '1' } : { 'opacity': '0' }]"></view-label>
        </div>
        
    </div>	
    `
    ,
    data() {
        return {
            viewer_state: 'map2D',
            map2D_labels: [
                
                {'id':'user-label', 'image':'./assets/here.png', 'text':"you're here"},
                {'id':'satellite-label', 'image':'./assets/satellite.png', 'text':"satellite"},
                {'id':'footprint-label', 'image':'./assets/dashed_circle.png', 'text':"footprint"},
                {'id':'path-label', 'image':'./assets/dotted_line.png', 'text':"traveled path"},
                {'id':'predicted-label', 'image':'./assets/continuous_line.png', 'text':"predicted path"},

            ]
        }
    },

    props: {
        tracking: {
            type: Boolean,
            required: true
        },
        object_path: {
            type: Array,
            required: true
        },
		selected_satellite: {
			type: String,
			required: true
		},
        tle_string: {
			type: String,
			required: true
		}
    },

    methods: {
        selectTab(element) {
            
            function highlightTab(element){

                elementClass = element.className;
    
                tabs = document.getElementsByClassName(elementClass);
            
                for (let index = 0; index < tabs.length; index++) {
                    tabs[index].style.opacity = 0.5;
                    tabs[index].style.borderBottomStyle = "solid";
                    tabs[index].style.borderWidth = "0.1px 0.1px 3px 0.1px";
                    tabs[index].style.fontWeight = 300;
                }
            
                element.style.opacity = 0.9;
                element.style.borderBottomStyle = "dashed";
                element.style.borderWidth = "3px 3px 0.1px 3px";
                element.style.fontWeight = 500;

            }
                    
            tab_ID = element.id;
                
            newState = tab_ID.substring(0, tab_ID.indexOf('-'));
            
            this.viewer_state = newState;

            highlightTab(element);
        }
    },

    mounted(){
        this.selectTab(document.getElementById('map2D-tab'));
    }

})