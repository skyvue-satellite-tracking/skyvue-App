app.component('satbot', {
    template: 
    /*html*/
    `
    <div @mouseover="showSatbot()" @mouseout="retreatSatbot()" id='satbot-container'>

        <div id="satbot-hook-container">
            <div id="satbot-hook">
                <img  id="satbot-img" text="satbot" src="./assets/satbot.jpeg" />
                <div class="satbot-loader-container">
                    <div class="loader" id="satbot-loader"></div>
                </div>
            </div>
            <div class="height-complement"></div>
        </div>

        <div v-show="satbot_display === 'full'" id="satbot-response-container">
            <div class="satbot-background-container">
                <img class="satbot-background" src="./assets/chatGPT.webp"/>
            </div>
            <div class="chatbot-data-display" >
                <div id="chatbot-response">
                    Hi! I am Satbot.
                    <br><br> 
                    I am a robot assistant with a great passion for all things related to space. 
                    <br><br>
                    I am here to help you digging into the satellites you are tracking.
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