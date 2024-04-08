app.component('meta-field', {
    template: 
        /*html*/
        `
        <div class="meta-field">
            <div class="meta-field-title">{{this.value[0]}}</div>
            <div id="source-meta">{{this.value[1]}}</div>
        </div>
        `
    ,

    props: {
        value: {
            type: Array,
            required: true
        },

    }
})