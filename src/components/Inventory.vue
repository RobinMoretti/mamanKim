<template>
  <div class="place-inventory" :style="inventoryStyle">
    <p-object 
        :space="name"
        :object="object" 
        v-for="(object, key) in placeObjects"
        :key="key">      
    </p-object>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    width: Number,
    height: Number,
  },
  computed: {
    inventoryStyle: function(){
      return "width: " + this.width + "; height: " + this.height + ";";
    },
    placeObjects: function () {
      if(this.name != "hands"){
        var placeStore = this.$store.state.places;
        return placeStore.places[this.name].inventory;
      }
      else {
        var placeStore = this.$store.state.places;
        return placeStore.player;
      }
    },
  },
  methods: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .place-inventory{
    border: black 1px solid;
    padding: 1rem;
  }
</style>
