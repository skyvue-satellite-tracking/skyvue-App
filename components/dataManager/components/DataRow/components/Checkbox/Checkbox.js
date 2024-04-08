app.component('checkbox', {
  template: 
  /*html*/
  `
  <label class="bin-b	utton data-manager-row-button" for="myCheckbox">
    <input checked type="checkbox" :id="id" name="myCheckbox">
  </label>
  `,
  props: {
    index: {
      type: String,
      required: true
    }
  },

  computed: {
    id(){
      return "checkbox-" + this.index;
    }
  },

  mounted(){
    let checkbox = document.getElementById(this.id);
    
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        console.log(this.id);
      }
      else {console.log(this.id);}
    })
  }

})

