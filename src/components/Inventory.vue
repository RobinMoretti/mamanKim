<template>
  <div>
    <div class="place-inventory" :id="name" :style="inventoryStyle">
      <p-object
          :space="name"
          :object="object"
          v-for="(object, key) in placeObjects"
          :key="key">
      </p-object>

      <span class="fictif">f</span>
    </div>

    <div class="informations">
      <p>Poid maximum: {{actualWeight}}/{{maximumWeight}}</p>
    </div>
  </div>
</template>

<script>
export default {
  // data: function () {
  //  return {
  //  }
  // },
  props: {
    name: String,
    activePlaceObj: Object
  },
  computed: {
    actualWeight: function(){
      var weight = 0;

      if(this.activePlaceObj.name == "hands"){
        weight = this.$store.state.places.playerActualWeight;
      }else{
        if(this.activePlaceObj.actualWeight){
          weight = this.activePlaceObj.actualWeight;
        }else {
          weight = 0;
        }
      }

      weight = Math.round((weight + Number.EPSILON) * 100) / 100

      return weight;
    },
    maximumWeight: function(){
      if(this.name == "hands"){
        return this.$store.state.places.playerMaximunWeight;
      }else if(this.activePlaceObj){

        var maximumWeight = null;

        if(this.activePlaceObj.maximumWeight){
          return this.activePlaceObj.maximumWeight;
        }
      }

      return "∞";
    },
    inventoryStyle: function(){
      var style = "";
      if(this.activePlaceObj && this.activePlaceObj.width && this.activePlaceObj.height){
        style += "width: " + (this.activePlaceObj.width + 2) + "px; height: " + (this.activePlaceObj.height) + "px;";
      }

      // if(this.activePlaceObj.infinite){
      //   style += "";
      // }
      if(this.activePlaceObj.scrollable){
        style += "overflow-y: scroll;";
      }


      return style;
    },
    placeObjects: function () {
      if(this.name != "hands"){
        // console.log("this.name = " + this.name);
        var placeStore = this.$store.state.places;
        return placeStore.places[this.name].inventory;
      }
      else {
        var placeStore = this.$store.state.places;
        return placeStore.player;
      }
    },
    objects: function(){
      return this.$store.state.objects.objects;
    },
  },
  methods: {
  },
  mounted: function(){
    this.$store.dispatch('places/updatePlaceWeight', this.name);
    // this.actualWeight = weight;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .place-inventory{
    padding-top: 4px;
    border: black 1px solid;
    // padding: 1rem;
    position: relative;
    overflow: visible;
    box-sizing: border-box;

    .fictif{
      opacity: 0;
      // margin-top: -4px !important;
      width: 20px; height: 20px;
      display: inline-block;
      border: 1px solid black;
      box-sizing: border-box;
      margin-top: -4px !important;
      min-width: 14px;
      min-height: 14px;
      font-size: 10px;
      display: inline-block;
      border: solid black 1px;
      padding: 2px;
      box-sizing: border-box;
      margin: 0;

      position: relative;
    }
  }
</style>
