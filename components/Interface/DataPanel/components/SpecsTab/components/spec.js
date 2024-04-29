app.component('spec', {
    template:
    /*html*/
    `
    <div>
        <div style="display: inline-flex; gap: 5px;">
            <div class="spec-info" :title="spec.info">?</div>
            <div>{{this.spec.name}}</div>
        </div> 
        <div class="data-field">
            <output style="cursor: default;" :id="spec.id" readonly value=" &nbsp"></output> 
           <!-- <div class="units coordinates-unit">deg</div> -->
        </div>
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