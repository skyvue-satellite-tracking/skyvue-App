const app = Vue.createApp( {

    data() {
        return{
            timestamp: "",
            selected_satellite: '',
            active_satellites: [],
            active_satellites_crossing_sky: [],
            tracking: false,
            //API configuration
            source_URL: 'skyVue API',
            locationNameByCoordinates_URL: 'https://api.wheretheiss.at/',
            // Collected data
            // object_path[i] = {index, name, id, latitude, longitude, altitude, velocity, visibility, footprint, time, timestamp, daynum, solar_lat, solar_lon, units};
            tle_string: '',
            object_path: new Array(),
            predicted_path: new Array(),
            // [latitude, longitute, altitude, country_code]
            user_location: new Array(),
            // Container for scheduled intervals.
            intervals: new Array(),
            // Container for scheduled timeouts.
            timeouts: new Array(),
            // Display configuration (time in miliseconds).
            data_update_rate: 5000,
            display_framerate: 1000,
            line_level_detail: 5,
            loader_time: 1000,
            units: 'kilometers',
            // possible values: 'retreated', 'full'
            satbot_display: 'retreated',
            active_satellites_count: [0],
            satellites_crossing_count: [0],
        }
    },

    methods: {

        resetInterface(){
            // Reset output variables and canvas.

            canvas2D.getContext('2d').clearRect(0, 0, canvas2D.width, canvas2D.height);

            mountedApp.object_path.length = 0;
            mountedApp.predicted_path.length = 0;

            // Cleaning all interface output fields.
            document.getElementById("latitude").value = ''; 
            document.getElementById("longitude").value = '';  
            document.getElementById("altitude").value = ''; 
            document.getElementById("velocity").value = ''; 
            // document.getElementById("visibility").value = ''; 
            document.getElementById("footprint").value = ''; 
            document.getElementById("time").value = ''; 
            // document.getElementById("daynum").value = ''; 
            // document.getElementById("solarlatitude").value = ''; 
            // document.getElementById("solarlongitude").value = ''; 
            // document.getElementById("units").value = ''; 

        },
        updateCommunityMapDatabase(timestamp, country_code) {
            // this.user_location;
            // this.timestamp;  

            data = {
                "country_code": country_code,
                "timestamp": timestamp
            };

            json_string = JSON.stringify(data);
            // console.log(data);
            
            fetch("https://easyfermi.com/CommunityMap/UpdateDatabase/", 
            {
             method: "POST",
             headers: {
                'Content-Type': 'application/json',
             },
             body: json_string,
            }).then((response) => response.json())
            .then((data) => {
                // console.log(data);
            });

        },


    },

    mounted() {
        
        setTimeout(() => {

            // const interval_Wiki = setInterval(updateWikiInfo, this.wiki_update_rate);
            
            // Initialize 3D map Sun ilumination.
            this.timestamp = (new Date()).getTime().toString().substring(0, 10);
            
            gradualOpacity('interface', 1500);    
            map2DGradualAppearance(3000);

            setTimeout(() => {
                updateEarthIlumination(this.timestamp);    
            }, 4000);
            
            setTimeout(() => {
                this.updateCommunityMapDatabase(this.timestamp, this.user_location[4]);                
            }, 8000);

        }, 100);

    }
} )
