app.component('specs-tab', {
    template: 
    /*html*/
    `
    <div class="display-system" id="specs-container">
    
        <div class="specs-flex">
        
            <div class="specs-header"> 
                <div class="loader" id="tle-loader"></div>  
                <div class="spec-info" title="Two-Line Element Set (TLE) is a data format encoding a list of orbital elements for an Earth-orbiting object at a specific point in time.">
                ?
                </div> 
                TLE

            </div>
            
            <div class="specs-data-display">
                <div id="specs-box">
                    <spec v-for="spec in specs" :spec="spec"></spec>
                    <br><br>    
                </div>
            </div>
            
        
        </div>

        <div style="opacity:0;" class="specs-flex">

           
        </div>

    </div>
    `
    ,
    data() {
        return {
            specs: [
                {id: 'name-spec', name:"NAME: ", info: ""},
                {id: 'norad-spec', name:'NORAD: ', info: "The NORAD Catalog Number, also known as the SATCAT, is a nine-digit sequential identifier assigned by the United States Space Command (USSPACECOM) to all artificial objects in Earth’s orbit and those that have left Earth’s orbit. It represents the order of launch or discovery and is used to track satellites and other space objects."},
                {id: 'classification-spec', name:'CLASSIFICATION: ', info: "U: Unclassified; C: Classified; S: Secret"},
                {id: 'launch-year-spec', name:'LAUNCH YEAR: ', info: "" },
                {id: 'launch-number-spec', name:'LAUNCH NUMBER: ', info: "Launch number of the year." },
                {id: 'piece-spec', name:'PIECE OF THE LAUNCH: ', info: "Piece of the launch."},
                {id: 'epoch-year-spec', name:'EPOCH YEAR: ', info: ""},
                {id: 'epoch-spec', name:'EPOCH: ', info: "Day of the year and fractional portion of the day"},
                {id: 'first-derivative-spec', name:'1° DERIVATIVE: ', info: "Mean motion first derivative."},
                {id: 'second-derivative-spec', name:'2° DERIVATIVE: ', info: "Mean motion second derivative."},
                {id: 'bstar-spec', name:'BSTAR: ', info: "Bstar drag term (leading decimal point assumed)."},
                {id: 'ephemeris-spec', name:'EPHEMERIS TYPE: ', info: ""},
                {id: 'inclination-spec', name:'INCLINATION: ', info: "(degrees)"},
                {id: 'ascension-spec', name:'RAAN: ', info: "Right Ascension of the Ascending Node (degrees)"},
                {id: 'eccentricity-spec', name:'ECCENTRICITY: ', info: "Leading decimal point assumed."},
                {id: 'perigee-spec', name:'PERIGEE: ', info: "Argument of perigee. (degrees)"},
                {id: 'mean-anomaly-spec', name:'MEAN ANOMALY: ', info: "(degrees)"},
                {id: 'mean-motion-spec', name:'MEAN MOTION: ', info: "(revolutions per day)"},
                {id: 'revolution-number-spec', name:'REVOLUTION NUMBER: ', info: "Number of revolution at epoch this TLE refers to."},
                {id: 'checksum-line1-spec', name:'CHECKSUM (LINE 1): ', info: "Indicates TLE's line 1 data integrity."},
                {id: 'checksum-line2-spec', name:'CHECKSUM (LINE 2): ', info: "Indicates TLE's line 2 data integrity."},
            ]
        }
    },
    props: {
        tracking: {
         type: Boolean,
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
    watch: {

        tracking(new_value, old_value){
            
            if(new_value === true){

                this.fetchTLE();
                
            }
        
        },

        tle_string(new_value, old_value){
          
            this.feedTLEFields();
            this.fetchSatbotInfo();                    
            this.fetchPredictedPath();
        }

    },

    methods: {

        // Request a satellite's TLE info based on its NORAD number. tle_string = JSON.stringify(tle);
        fetchTLE() {

            tleActivityLogging('waiting');
            // satid = "25544";
            // satname = "SPACE STATION";
            // tle = "1 25544U 98067A   24094.84846175  .00015613  00000-0  28196-3 0  9997\r\n2 25544  51.6410 323.9627 0004432  35.1300  67.4967 15.49897640447014";
            
            // https://sky-vue-api.onrender.com/tle/satellite_norad_number
            API_URL = "https://skyvue-ai.onrender.com/TLE?satid=" + this.selected_satellite;
            fetch(API_URL)
            .then((response) => (response.json()))
            .then((data) => {
                mountedApp.tle_string = JSON.stringify(data);
                tleActivityLogging('answered');
            })

        },
        
        feedTLEFields(){
            
            tle_object = JSON.parse(this.tle_string);

            satname = tle_object.info.satname;
            satid = tle_object.info.satid;
            tle = tle_object.tle;

            tle_line1 = tle.substring(0, tle.indexOf("\r\n")).trim();
            tle_line2 = tle.substring(tle.indexOf("\r\n"), tle.length).trim();
            
            // Line 1:
            satellite_number = tle_line1.substring(2, 7).trim();
            satellite_classification = tle_line1.substring(7, 8).trim();
            satellite_launch_year = tle_line1.substring(9, 11).trim();
            // Converting year to 4 digits format, e.g., from 98 to 1998 and 11 to 2011.
            // So far, it is only unambiguous before 2030.
            if (satellite_launch_year === '') {
            }
            else if (Number(satellite_launch_year) < 30) {
                satellite_launch_year = '20' + satellite_launch_year;
            }
            else { satellite_launch_year = '19' + satellite_launch_year;
            }
            satellite_launch_number = tle_line1.substring(11, 14).trim();
            piece_of_the_launch = tle_line1.substring(14, 17).trim();
            epoch_year = tle_line1.substring(18, 20).trim();
            epoch = tle_line1.substring(20, 32).trim();
            mean_motion_first_derivative = tle_line1.substring(33, 43).trim();
            mean_motion_second_derivative = tle_line1.substring(44, 52).trim();
            bstar = tle_line1.substring(53, 61).trim();
            ephemeris_type = tle_line1.substring(62, 63).trim();
            checksum1 = tle_line1.substring(68, 69).trim();
             
            // Line 2:
            inclination = tle_line2.substring(8, 16).trim();
            right_ascension = tle_line2.substring(17, 25).trim();
            eccentricity = tle_line2.substring(26, 33).trim();
            perigee = tle_line2.substring(34, 42).trim();
            mean_anomaly = tle_line2.substring(43, 51).trim();
            mean_motion = tle_line2.substring(52, 63).trim();
            revolution_number = tle_line2.substring(63, 68).trim();
            checksum2 = tle_line2.substring(68, 69).trim();

            document.getElementById('name-spec').value = satname;
            document.getElementById('norad-spec').value = satid;
            document.getElementById('classification-spec').value = satellite_classification;
            document.getElementById('launch-year-spec').value = satellite_launch_year;
            document.getElementById('launch-number-spec').value = satellite_launch_number;
            document.getElementById('piece-spec').value = piece_of_the_launch;
            document.getElementById('epoch-year-spec').value = epoch_year;
            document.getElementById('epoch-spec').value = epoch;
            document.getElementById('first-derivative-spec').value = mean_motion_first_derivative;
            document.getElementById('second-derivative-spec').value = mean_motion_second_derivative;
            document.getElementById('bstar-spec').value = bstar;
            document.getElementById('ephemeris-spec').value = ephemeris_type;
            document.getElementById('inclination-spec').value = inclination;
            document.getElementById('ascension-spec').value = right_ascension;
            document.getElementById('eccentricity-spec').value = eccentricity;
            document.getElementById('perigee-spec').value = perigee;
            document.getElementById('mean-anomaly-spec').value = mean_anomaly;
            document.getElementById('mean-motion-spec').value = mean_motion;
            document.getElementById('revolution-number-spec').value = revolution_number;
            document.getElementById('checksum-line1-spec').value = checksum1;
            document.getElementById('checksum-line2-spec').value = checksum2;
            
        }
        ,
        fetchSatbotInfo(){

            tle_object = JSON.parse(this.tle_string);

            satname = tle_object.info.satname;
            satid = tle_object.info.satid;

            if (((satname === "") || (satname === undefined)) && ((satid === "") || (satid === undefined))) {
                return
            }

            satbotActivityLogging('waiting')

            API_URL = "https://skyvue-ai.onrender.com/Satbot?satid=" + satid + "&satname=" + satname;
            fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {

                // console.log(data);
                document.getElementById('chatbot-response').textContent = data;
                satbotActivityLogging('answered')

            })

        },

        fetchPredictedPath(){

            tle_object = JSON.parse(this.tle_string);

            satname = tle_object.info.satname;
            satid = tle_object.info.satid;
            tle = tle_object.tle;

            tle_line1 = tle.substring(0, tle.indexOf("\r\n")).trim();
            tle_line2 = tle.substring(tle.indexOf("\r\n"), tle.length).trim();
            
            // console.log(encodeURI(tle_line1));
            // console.log(encodeURI(tle_line2));
            
            // Request computed orbit based on the TLE info.
            API_URL = "https://easyfermi.com/computeOrbit/" + "?tle_line1=" + tle_line1 + "&tle_line2=" + tle_line2;
            fetch(API_URL)
            .then((response) => response.json())
            .then((data) => {
              
                // console.log(data);

                mountedApp.predicted_path = data;
        
            });
        
        }
    }
})