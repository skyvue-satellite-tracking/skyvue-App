const app = Vue.createApp( {

    data() {
        return{
            active_satellites_tle: [],
            selected_satellite: '',
            tracking: false,
            //API configuration
            source_URL: '',
            locationNameByCoordinates_URL: 'https://api.wheretheiss.at/',
            // Collected data
            // object_path[i] = {index, name, id, latitude, longitude, altitude, velocity, visibility, footprint, time, daynum, solar_lat, solar_lon, units};
            object_path: new Array(),
            predicted_path: new Array(),
            user_location: new Array(),
            // Container for scheduled intervals.
            intervals: new Array(),
            // Container for scheduled timeouts.
            timeouts: new Array(),
            // Display configuration (time in miliseconds).
            wiki_update_rate: 10000,
            data_update_rate: 5000,
            display_framerate: 1000,
            line_level_detail: 5,
            loader_time: 1000,
            units: 'kilometers'
        }
    },

    methods: {

        showAllSatellites(){

            // So far I've got a complete list of currently active satellites, 
            // but the response, not really surprinsinly, doesn't come with
            // the positions. It would be necessary, now with data massive data, to have access to a really fast, and
            // likely paid API to request the current positions of all satellites one by one.
            
            // API_URL = "https://sky-vue-api.onrender.com/tle/all";

            // fetch(API_URL)
            // .then((response) => response.json())
            // .then((data) => {

            //     data.forEach(sat => {
            //         this.active_satellites_tle.push(
            //             {name:sat.OBJECT_NAME, id:sat.NORAD_CAT_ID}
            //         )
            //     });

            // })
        },

        
        resetInterface(){
            // Reset output variables and canvas.

            canvas2D.getContext('2d').clearRect(0, 0, canvas2D.width, canvas2D.height);

            mountedApp.object_path.length = 0;

            // Cleaning all interface output fields.
            document.getElementById("latitude").value = ''; 
            document.getElementById("longitude").value = '';  
            document.getElementById("altitude").value = ''; 
            document.getElementById("velocity").value = ''; 
            document.getElementById("visibility").value = ''; 
            document.getElementById("footprint").value = ''; 
            document.getElementById("time").value = ''; 
            // document.getElementById("daynum").value = ''; 
            document.getElementById("solarlatitude").value = ''; 
            document.getElementById("solarlongitude").value = ''; 
            // document.getElementById("units").value = ''; 

        },

    },

    mounted() {
        
        setTimeout(() => {

            const interval_Wiki = setInterval(updateWikiInfo, this.wiki_update_rate);
            
            // Making data-display and main-window elements have the same height.
            makeSameHeightByID("data-display", "main-window");
            window.onresize = function() {
                makeSameHeightByID("data-display", "main-window");
            };
        
            // Initialize 3D map Sun ilumination.
            let timestamp = (new Date()).getTime().toString().substring(0, 10);
            updateEarthIlumination(timestamp);
        
            gradualOpacity('interface', 1500);    
            map2DGradualAppearance(3000);

            this.showAllSatellites();

        }, 100);

    }


} )
