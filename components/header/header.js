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

                        <div class="sky-status">
                            <div class="status-info" :title="info.ACTIVE_SATELLITES">?</div> 
                            <div class="sky-status-field-name">ACTIVE SATELLITES:</div>
                            <div class="sky-status-field-value">{{this.active_satellites_count}}</div>
                        </div>

                        <div class="sky-status">
                            <div class="status-info" :title="info.CROSSING_YOUR_SKY">?</div> 
                            <div class="sky-status-field-name">CROSSING YOUR SKY:</div>
                            <div class="sky-status-field-value">{{this.crossing_sky_count}}</div>
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
            debris: [],
            crossing_sky: [],
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
                // this.fetchSatellitesCrossingUserSky();
            }
        },
        active_satellites(new_value, old_value){
            if (new_value.length > 0) {
                // this.showAllActiveSatellites();   
            }
        }

    },
    computed: {
        active_satellites_count() {
            return this.active_satellites.length;
        },
        debris_count() {
            return this.debris.length;
        },
        crossing_sky_count() {
            return this.crossing_sky.length;
        }
    },
    methods: {
        fetchActiveSatellites() {
            fetch('https://skyvue-ai.onrender.com/AllActiveSatellites')
            .then((response => response.json()))
            .then((data) => {
                this.active_satellites = data;
            })
        },
        fetchSatellitesCrossingUserSky() {

            latitude = this.user_location[0];
            longitude = this.user_location[1];
            altitude = this.user_location[2];

            fetch('https://skyvue-ai.onrender.com/SatellitesCrossingUserSky?latitude=' + latitude + '&longitude=' + longitude + '&altitude=' + altitude)
            .then((response => response.json()))
            .then((data) => {
                this.crossing_sky = data.above;
            })
        },
        fetchDebris() {

        },

        showAllActiveSatellites(){
            
            this.active_satellites.forEach(satellite => {
                // console.log(satellite);
            });

        },
    },
    mounted() {
        // this.fetchActiveSatellites();
        this.fetchDebris();
    }

})