<template>
  <span class="object">
    <span v-on:click="picked" v-html="objects[object.name].picto" v-if="objects != null && object"></span>
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
  computed:{
    objects: function(){
      return this.$store.state.objects.objects;
    },
    playMode: function(){
      return this.$store.state.playMode;
    },
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
      if(this.playMode == "picking"){
        console.log("this.space = ", this.space);
        if (this.space != "hands") {
          this.$store.commit("places/removeObject", { place: this.space, object: this.object })
          this.$store.commit("places/addObject", { place: "hands", object: this.object })
        }else {
          this.$store.commit("places/removeObject", { place: "hands", object: this.object })
          this.$store.commit("places/addObject", { place: this.$store.state.places.activePlace, object: this.object });
          console.log(this.$store.state.places.activePlace)
        }
      }else if(this.playMode == "looking"){
        this.displayObject();
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
