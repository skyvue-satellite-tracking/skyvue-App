app.component('map2D-tab', {
    template:
    /*html*/
    `
    <div class="display-system" id="map2D-container">
    
        <img v-show="path_length > 0 && tracking" id="satellite" src="assets/satellite.png" alt="a mundi map" lang="en">
        <div v-show="path_length > 0 && tracking" id="visibility-radius"></div>
        <img v-show="path_length > 0 && tracking" width="20px" id="satellite-location-flag">
        <div v-show="path_length > 0 && tracking" id="satellite-location-name"></div>
        
        <img id="user-location" src="assets/here.png" alt="here" lang="en">
        <img width="20px" id="user-location-flag">
        <div id="user-location-name"></div>

        <img id="map2D-img" src="./assets/map2D.png">
        <canvas id="canvas2D"></canvas>

        <div @mousemove="placeCross($event)" @mouseout="crossOff()" @mouseover="crossOn()" id="cursor-cross">
            <div id="parallel" @mouseover="crossOn()" v-show="crossDisplay">
                <div id="latitude-value">{{this.crossLatitude}}</div>
            </div>
            <div id="meridian" @mouseover="crossOn()" v-show="crossDisplay">
                <div id="longitude-value">{{this.crossLongitude}}</div>
            </div>
        </div>

        
    </div>

    `
    ,
    data() {
        return {
            crossDisplay: false,
            crossLatitude: '0',
            crossLongitude: '0',
        }
    }
    ,
    props: {
        tracking: {
            type: Boolean,
            required: true
        },
        object_path: {
            type: Array,
            required: true
        }
    },
    computed: {
        path_length(){
            return this.object_path.length;
        }
    },
    watch: {

        path_length(new_value, old_value){
        
            updateNationalFlagPosition(mountedApp.object_path);                   

        }

    },
    methods: {
        placeCross(event) {

            y = event.layerY;
            x = event.layerX;
        
            crossYPosition = 100 *(1 - (y / 400));
            crossXPosition = 100 * (1 - (x / 800));
            
            document.getElementById('parallel').style.bottom = crossYPosition + '%';
            document.getElementById('meridian').style.right = crossXPosition + '%';

            this.crossLatitude = ((crossYPosition / 100) * 180 - 90).toFixed(0) + '°';
            this.crossLongitude = ((-1)*((crossXPosition / 100) * 360 - 180)).toFixed(0) + '°';
        },
        crossOff(){
            this.crossDisplay = false;
        },
        crossOn() {
            this.crossDisplay = true;
        }
    }
})