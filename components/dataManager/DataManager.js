app.component('data-manager', {
    template:
    /*html*/
    `
    
    <div id="data-manager-container">
        <div id="data-manager-screen">
            
            <div id="close-button-container">
                <div @click="closeDataManager()" class="close-button" id="data-manager-close-button">x</div>
            </div>
            
            <div id="data-manager-title-container">
                <div id="data-manager-title"><img src="./assets/data.png" width="60px">Data Manager</div>
            </div>
            
            <div id="download-button-container">
                <div class="download-button-box">
                    <a id="download-button" class="download-button"><img src="./assets/export.png" width="30px">DOWNLOAD DATA</a>
                </div>
            </div>
            
            <div class="data-table-container">
                <div id="data-table">

                    <data-row id="data-header" :field_data="data_header"></data-row>
                    
                    <data-row id="data-units" :field_data="data_units"></data-row>

                    <data-row v-for="field_data in object_path" :id="field_data.index" :field_data="field_data"></data-row>

                </div>
            </div>
            
            <div class="metadata-container">
                <div id="metadata">

                    <meta-field v-for="(value, index) in Object.entries(sourceMeta)" :value="value"></meta-field>

                </div>
            </div>
            
        </div>
    </div>
    `
    ,

    data(){

        return {
            data_header: {'index': '#', 'name':'NAME', 'id':'ID', 'latitude':'LATITUDE', 'longitude':'LONGITUDE', 'altitude':'ALTITUDE', 'velocity':'VELOCITY', 'visibility':'VISIBILITY', 'footprint':'FOOTPRINT', 'time':'TIME', 'daynum':'DAYNUM', 'solarlatitude':'SOLAR LAT.', 'solarlongitude':'SOLAR LON.', 'units':'UNITS'},
            data_units: {'index': '()', 'name':'()', 'id':'()', 'latitude':'(degrees)', 'longitude':'(degrees)', 'altitude':'(km)', 'velocity':'(km/h)', 'visibility':'()', 'footprint':'(Km)', 'time':'(GMT)', 'daynum':'()', 'solarlatitude':'(degrees)', 'solarlongitude':'(degrees)', 'units':'()'},
        }

    },

    updated(){

        this.setDownloadButton();

    },

    props: { 
        object_path: {
            type: Array,
            required: true
        },
        units: {
            type: String,
            required: true
        },
        source: {
            type: String,
            required: true
        }
    },

    methods: {
        
        closeDataManager(){
            document.getElementById('data-manager-container').style.display = 'none';
        },

        setDownloadButton(){

            if (this.object_path.length > 0) {
        
                let headerArray = [Object.values(this.data_header)];
                let unitsArray = [Object.values(this.data_units)];
                let pathArray = this.object_path.map(obj => Object.values(obj));
                    
                // console.dir(headerArray);
                // console.dir(unitsArray);
                // console.dir(pathArray);
    
                // Concatenate the arrays (creates a new array)
                var combinedArray = headerArray.concat(unitsArray, pathArray);
                
                for (let i = 0; i < combinedArray.length; i++) {
                    for (let j = 0; j < combinedArray[i].length; j++) {
                        if (combinedArray[i][j] != undefined) {
                            combinedArray[i][j] = combinedArray[i][j].toString();    
                        }
                    }
                }
            
                // console.dir(combinedArray);
                
                const csvContent = combinedArray.map(row => row.join(',')).join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                
                downloadButton =  document.getElementById('download-button');
                downloadButton.href = URL.createObjectURL(blob);
                downloadButton.download = this.object_path[0].name + '.csv';    
            }

        }

    },

    computed: {

        sourceMeta(){
        
            path = this.object_path;

            if (path.length > 0){
                return {'source: ': this.source.toString(), 'name: ': path[0].name.toString(), 'id: ': path[0].id.toString(), 'rows: ': this.object_path.length.toString(), 'columns: ': Object.keys(path[0]).length.toString(),'units: ':this.units.toString()} 
            }

            return {'source: ': '', 'name: ': '', 'id: ': '', 'rows: ': '', 'columns: ': '','units: ': ''}
        }

    }

})


