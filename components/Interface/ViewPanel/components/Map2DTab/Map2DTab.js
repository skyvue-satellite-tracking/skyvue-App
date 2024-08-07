app.component('map2D-tab', {
    template:
    /*html*/
    `
    <div class="display-system" id="map2D-container">
    
        <img alt="Satellite figure" v-show="path_length > 0 && tracking" id="satellite" src="assets/header_satellite.png" lang="en">
        <div v-show="path_length > 0 && tracking" id="footprint-radius"></div>
        <img alt="" v-show="path_length > 0 && tracking" id="satellite-location-flag">
        <div v-show="path_length > 0 && tracking" id="satellite-location-name"></div>
        
        <img alt="user's location image" id="user-location" src="assets/here.png" style="background-color:rgba(40,40,40,1)" lang="en">
        <img alt="" id="user-location-flag">
        <div id="user-location-name"></div>

        <img alt="2D map" id="map2D-img" src="./assets/map2D.png">
        <canvas id="canvas2D" class="canvas2D"></canvas>
        <canvas id="canvas2D_active_satellites" class="canvas2D" style="opacity:1;"></canvas>
        <canvas id="canvas2D_crossing_sky" class="canvas2D" style="opacity:0;"></canvas>

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
        },
    },
    watch: {

        path_length(new_value, old_value){
        
            updateNationalFlagPosition(mountedApp.object_path);                   

        },
   
    },
    methods: {
        placeCross(event) {

            y = event.layerY;
            x = event.layerX;
        
            let map_width = document.getElementById('map2D-img').offsetWidth; 
            let map_height = document.getElementById('map2D-img').offsetHeight;

            crossYPosition = 100 *(1 - (y / map_height));
            crossXPosition = 100 * (1 - (x / map_width));
            
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
        },
        resizeCanvas() {
                    
            let canvas2D_list = document.getElementsByClassName('canvas2D');

            for (let index = 0; index < canvas2D_list.length; index++) {
                canvas2D_list[index].width = document.getElementById('screen').offsetWidth;                
                canvas2D_list[index].height = document.getElementById('screen').offsetHeight;                
            }

        }
    },
    mounted() {

        this.resizeCanvas();

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            if (mountedApp.user_location.length > 0) {
                setTimeout(() => {
                    setMapObjectPosition(mountedApp.user_location[0], mountedApp.user_location[1]);  
                    
                    let canvas_ctx = document.getElementById('canvas2D_active_satellites').getContext('2d'); 
                    drawArray(mountedApp.active_satellites, 100, 'rgba(160, 255, 160, 0.7)', 0.5, 10, canvas_ctx, 0);
                    
                    canvas_ctx = document.getElementById('canvas2D_crossing_sky').getContext('2d');
                    drawArray(mountedApp.active_satellites_crossing_sky, 100, 'rgba(160, 255, 160, 1)', 0.5, 10, canvas_ctx, 0);
                             
                }, 100);
            }
        })

        

    }
})