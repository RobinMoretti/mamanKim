<template>
  <span class="object">
    <span v-on:click="picked">{{ object.name }}</span> - 
    <span v-on:click="displayObject">détails</span> <!-- <span v-on:click="deleteObject">X</span> -->
  </span>
</template>

<script>
export default {
  props: {
    object: Object,
    space: {
      type: String,
    }
  },
  methods: {
    deleteObject: function(){
      if (this.space != "hands") {
        this.$store.commit("places/removeObject", { place: this.space, object: this.object })
      }else {
        this.$store.commit("places/removeObject", { place: "hands", object: this.object })
      }
    },
    picked: function(){
      if (this.space != "hands") {
        this.$store.commit("places/removeObject", { place: this.space, object: this.object })
        this.$store.commit("places/addObject", { place: "hands", object: this.object })
      }else {
        this.$store.commit("places/removeObject", { place: "hands", object: this.object })
        this.$store.commit("places/addObject", { place: this.$store.state.places.activePlace, object: this.object });
        console.log(this.$store.state.places.activePlace)
      }
    },
    displayObject: function(){
      this.$store.commit("objects/setActiveObject", this.object);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
