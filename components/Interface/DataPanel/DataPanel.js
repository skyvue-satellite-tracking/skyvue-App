app.component('data-panel', {
    template:
    /*html*/
    `
    <div id="data-display" >
		<div id="log-box" >
			<div class="loader" id="log-loader"></div>
			<div id="log" ></div>
		</div>
		
		<div id="data-tabs">
			<div @click="selectTab($event.target)" class="data-tab" id="source-tab">SOURCE</div>
			<div @click="selectTab($event.target)" class="data-tab" id="data-tab">DATA</div>
			<div @click="selectTab($event.target)" class="data-tab" id="config-tab">CONFIG.</div>
		</div>
		
		<source-tab v-show="data_display_state === 'source'" :tracking="tracking"></source-tab>
		<data-tab :object_path="object_path" v-show="data_display_state === 'data'"></data-tab>
		<config-tab  v-show="data_display_state === 'config'" :source="source" :tracking="tracking"></config-tab>				
	
	</div>
    `
    ,
    data() {
        return {
            
            data_display_state: 'source'
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
		source: {
			type: String,
			required: true
		},
		object_path: {
            type: Array,
            required: true
        },
    },
    methods: {
        selectTab(element){

			function highlightTab(element){
				elementClass = element.className;

				tabs = document.getElementsByClassName(elementClass);
			
				for (let index = 0; index < tabs.length; index++) {
					tabs[index].style.opacity = 0.5;
					tabs[index].style.borderBottomStyle = "solid";
					tabs[index].style.borderWidth = "0.1px 0.1px 3px 0.1px";
					tabs[index].style.fontWeight = 300;
				}
			
				element.style.opacity = 0.9;
				element.style.borderBottomStyle = "dashed";
				element.style.borderWidth = "3px 3px 0.1px 3px";
				element.style.fontWeight = 500;
			}
            
            tab_ID = element.id;
    
            newState = tab_ID.substring(0, tab_ID.indexOf('-'));
    
            this.data_display_state = newState;

			highlightTab(element);
			
        }
    }
	,
	mounted(){

		this.selectTab(document.getElementById('source-tab'));

	}
})