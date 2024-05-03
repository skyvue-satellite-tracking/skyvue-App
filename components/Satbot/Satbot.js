app.component('satbot', {
    template: 
    /*html*/
    `
    <div @mouseover="showSatbot()" @mouseout="retreatSatbot()" id='satbot-container'>

        <div id="satbot-hook-container">
            <div id="satbot-hook">
                <div class="satbot-loader-container">
                    <div class="loader" id="satbot-loader"></div>
                </div>
            </div>
            <div class="height-complement"></div>
        </div>

        <div v-show="satbot_display === 'full'" id="satbot-response-container">
            <div class="satbot-background-container">
                <img alt="Satbot response background." class="satbot-background" src="./assets/chatGPT.webp"/>
            </div>
            <div class="chatbot-data-display" >
                <div id="chatbot-response">
                    Hi! I am Satbot.
                    <br><br> 
                    I am a robot assistant with a great passion for space science. 
                    <br><br>
                    I'm here to help you find out more about the satellites you're interested in.
                </div>
                
            </div>
        </div>

    </div>
    `
    ,
    props: {
        satbot_display: {
            type: String,
            required: true
        }
    },
    methods: {
        showSatbot() {
            mountedApp.satbot_display = 'full';
        },
        retreatSatbot() {
            mountedApp.satbot_display = 'retreated';
        },
        
    }


})