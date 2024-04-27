app.component('header-vue', {
    template: 
    /*html*/
    `
    
	<header id="header">
        <div class ="header-grid">
            <div class="header-box">
                <img id="logo" src="assets/skyvue_logo.jpeg">
                <div id="sky-status-container">
                    <img id="header-satellite" src="./assets/header_satellite.png">
                    <div id="sky-status-flex">

                        <div @mouseover="show_all_active_satellites = true" @mouseout="show_all_active_satellites = false" class="sky-status">
                            <div class="status-info" :title="info.ACTIVE_SATELLITES">?</div> 
                            <div class="sky-status-field-name">ACTIVE SATELLITES:</div>
                            <div class="sky-status-field-value" style="color: rgba(100, 250, 100, 1);">{{this.active_satellites_count}}</div>
                            <div @click="updateActiveSatellitesPositions();" class=refresh-button><img src="./components/header/assets/refresh_button.png" /></div>
                        </div>

                        <div @mouseover="show_active_satellites_crossing_sky = true" @mouseout="show_active_satellites_crossing_sky = false" class="sky-status">
                            <div class="status-info" :title="info.CROSSING_YOUR_SKY">?</div> 
                            <div class="sky-status-field-name">CROSSING YOUR SKY:</div>
                            <div class="sky-status-field-value" style="color: rgba(100, 250, 100, 1);">{{this.crossing_sky_count}}</div>
                            <div @click="updateSatellitesCrossingSkyPositions();" class=refresh-button><img src="./components/header/assets/refresh_button.png" /></div>
                        </div>

                    </div>
                </div>
            </div>
            
            <div id="social-links">
                <a target="_blank" href="https://twitter.com/home"><img src="./assets/X.png" width="28px"></a>
                <a target="_blank" href="https://github.com/skyvue-satellite-tracking"><img src="./assets/github.png" width="35px"></a>
            </div>

        </div>
    </header>
    `,
    data() {
        return {
            active_satellites: [],
            active_satellites_tle: [],
            active_satellites_crossing_sky: [],
            show_all_active_satellites: false,
            show_active_satellites_crossing_sky: false,
            debris: [],
            objects_crossing_sky: [],
            info: {
                'ACTIVE_SATELLITES': '',
                'DEBRIS': 'Space debris, also known as space junk or cosmic debris, refers to defunct human-made objects in space that no longer serve a useful function. This includes nonfunctional spacecraft, abandoned launch vehicle stages, mission-related debris, and fragments from disintegration, erosion, or collisions. Space debris poses a risk to operational spacecraft due to the potential for collision.',
                'CROSSING_YOUR_SKY': "Objects (active satellites and debris) within a search radius of 90° with respect to the point in the sky directly above the observer's location (azimuth).",
            }
        }
    },
    props: {
        user_location: {
            type: Array,
            required: true
        }
    }
    ,
    watch: {
        user_location(new_value, old_value) {
            if (new_value.length == 3) {
                this.fetchSatellitesCrossingUserSky();
            }
        },
        show_all_active_satellites(new_value, old_value){
            if (new_value === true) {

                this.showAllActiveSatellites();
                
            } else{
                this.hideAllActiveSatellites();
            }
        },
        show_active_satellites_crossing_sky(new_value, old_value){
            if (new_value === true) {

                this.showActiveSatellitesCrossingUserSky();
                
            } else{
                this.hideActiveSatellitesCrossingUserSky();
            }
        },
        active_satellites() {

            let canvas_ctx = document.getElementById('canvas2D_active_satellites').getContext('2d');
            drawArray(this.active_satellites, 100, 'rgba(160, 255, 160, 1)', 0.05, 150, canvas_ctx);
        },
        active_satellites_crossing_sky() {
            let canvas_ctx = document.getElementById('canvas2D_crossing_sky').getContext('2d');
            drawArray(this.active_satellites_crossing_sky, 100, 'rgba(160, 255, 160, 1)', 0.05, 150, canvas_ctx);
        },

    },
    computed: {
        active_satellites_count() {
            // It is devided by three because the tle list has 3 lines per satellite, i.e., it is a 3LE format.
            return this.active_satellites.length;
        },
        debris_count() {
            return this.debris.length;
        },
        crossing_sky_count() {

            // Regex expression to filtering only strings that does not contain 'DEB' or 'R/B' patterns.
            let regex_codes_for_debries = '^((?!DEB|R\/B).)*$';

            // Filtering only objects not classified as debris.
            this.active_satellites_crossing_sky = this.objects_crossing_sky.filter(satellite => satellite.satname.match(regex_codes_for_debries));

            return this.active_satellites_crossing_sky.length;
        }
    },
    methods: {
        fetchActiveSatellites() {
  
            let celestrack_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle";
            let skyvue_php_source = "https://easyfermi.com/AllActiveSatellites/";
            let skyvue_python_source = "https://skyvue-ai.onrender.com/AllActiveSatellites";

            // Letting celestrck direct link makes each user responsible by the use of this resource, since it is its own IP in use for these requests. 
            // Differently from the N2YO plataform, Celestrak allows that approach.
            fetch(celestrack_URL)
            .then((response => response.text()))
            .then((body) => {

                this.active_satellites_tle = body;

                this.fetchPositionFromTLE(this.active_satellites_tle);

            })

        },
        fetchPositionFromTLE(satellites_tle_array){
                     
            let test_array = "CALSPHERE 1\n1 00900U 64063C   24117.56436043  .00001716  00000+0  17860-2 0  9992\n2 00900  90.2043  54.2710 0027073 131.1214  42.8462 13.74946808963936\nCALSPHERE 2\n1 00902U 64063E   24117.57333720  .00000136  00000+0  19110-3 0  9999\n2 00902  90.2196  57.8402 0017884 342.8630 191.9104 13.52793224750588";

            fetch("https://easyfermi.com/ComputePositionFromTLE/", 
            {
             method: "POST",
             body: satellites_tle_array,
            }).then((response) => response.json())
            .then((data) => {
                this.active_satellites = data;
            });
        }

        ,
        fetchSatellitesCrossingUserSky() {

            latitude = this.user_location[0];
            longitude = this.user_location[1];
            altitude = this.user_location[2];

            fetch('https://skyvue-ai.onrender.com/SatellitesCrossingUserSky?latitude=' + latitude + '&longitude=' + longitude + '&altitude=' + altitude)
            .then((response => response.json()))
            .then((data) => {
                
                // Changing satlat, satlon and satalt element properties, respectively, to latitude, longitude, altitude.
                
                this.objects_crossing_sky = data.above;
                
                this.objects_crossing_sky.forEach(element => {

                    element.latitude = element.satlat;
                    element.longitude = element.satlng;
                    element.altitude = element.satalt;

                    delete(element.satlat);
                    delete(element.satlng);
                    delete(element.satalt);

                });


            })
        },
        fetchDebris() {

        },

        showAllActiveSatellites(){
            
            document.getElementById('canvas2D_active_satellites').style.opacity = 1;

        },
        showActiveSatellitesCrossingUserSky(){

            document.getElementById('canvas2D_crossing_sky').style.opacity = 1;

        },
        hideAllActiveSatellites(){

            document.getElementById('canvas2D_active_satellites').style.opacity = 0;
        
        },
        hideActiveSatellitesCrossingUserSky(){

            document.getElementById('canvas2D_crossing_sky').style.opacity = 0;
        
        },

        updateActiveSatellitesPositions(){
            let canvas_ctx = document.getElementById('canvas2D_active_satellites').getContext('2d');
            canvas_ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);

            this.fetchPositionFromTLE(this.active_satellites_tle);
        },

        updateSatellitesCrossingSkyPositions(){
            
            let canvas_ctx = document.getElementById('canvas2D_crossing_sky').getContext('2d');
            canvas_ctx.clearRect(0, 0, canvas2D.width, canvas2D.height);
            
            this.fetchSatellitesCrossingUserSky();
        }



    },
    mounted() {
        this.fetchActiveSatellites();
        this.fetchDebris();
    }

})