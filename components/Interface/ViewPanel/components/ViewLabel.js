app.component('view-label', {
    template:
    /*html*/
    `
    <div class="label" :id="label.id" style="opacity: 0.9;">
        <img class="label-img" :src="label.image">
        <div class="label-text">{{this.label.text}}</div>
    </div>
    `
    ,
    props: {
        label: {
            type: Object,
            required: true
        }
    }
})