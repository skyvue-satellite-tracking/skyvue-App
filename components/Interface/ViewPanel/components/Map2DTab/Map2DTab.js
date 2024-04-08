app.component('map2D-tab', {
    template:
    /*html*/
    `
    <div class="display-system" id="map2D-container">
        <img id="map2D-img" src="./assets/map2D.png">
        <img v-show="path_length > 0 && tracking" id="satellite" src="assets/satellite.png" alt="a mundi map" lang="en">
        <div v-show="path_length > 0 && tracking" id="visibility-radius"></div>
        <img id="user-location" src="assets/here.png" alt="here" lang="en">
        <img width="20px" id="user-location-flag">
        <img v-show="path_length > 0 && tracking" width="20px" id="satellite-location-flag">
        <div v-show="path_length > 0 && tracking" id="satellite-location-name"></div>
        <div id="user-location-name"></div>
        <canvas id="canvas2D"></canvas>
    </div>

    `
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
    }
})