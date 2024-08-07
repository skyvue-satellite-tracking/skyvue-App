app.component('data-row', {
    template:
        /*html*/
        `
        <div class="data-row-container">
            <div class="data-row">
                <div v-for="item in field_data" class="data-manager-data-field">{{item}}</div>
            </div>
<!--            <div class="data-row-gadgets">
                <img alt="Copy to clipboard button." onclick="copyRowData(event)" src="./components/dataManager/assets/copy.png" class="copyButton data-manager-row-button">
                <checkbox :index='index'></checkbox>
            </div>
-->
        </div>
    
    `
    ,
    props: {
        field_data: {
            type: Object,
            required: true 
        },
    }
    ,
    computed: {
        index() {
            return this.field_data.index.toString();
        }
    }
})