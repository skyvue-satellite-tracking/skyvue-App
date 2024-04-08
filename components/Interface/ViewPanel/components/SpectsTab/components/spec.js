app.component('spec', {
    template:
    /*html*/
    `
    <div class="spec">
        <div style="display: inline-flex; gap: 5px;">
            <div class="spec-info" :title="spec.info">?</div>
            <div class="spec-name">{{this.spec.name}}</div>	
        </div>
        <output class="spec-value" :id="spec.id" readonly value=""></output>
    </div>
    `
    ,
    props: {
        spec: {
            type: Object,
            required: true
        }
    },
    
})