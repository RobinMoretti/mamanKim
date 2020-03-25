<template>
  <div>
    <div class="place-inventory" :style="inventoryStyle">
      <p-object
          :space="name"
          :object="object"
          v-for="(object, key) in placeObjects"
          :key="key">
      </p-object>
    </div>

    <div class="informations">
      <p>Poid maximum: {{actualWeight}}/{{maximumWeight}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    activePlaceObj: Object
  },
  computed: {
    actualWeight: function(){
      var weight = 0;

      for (var i = 0; i < this.placeObjects.length; i++) {
        var iObject = this.objects[this.placeObjects[i].name];

        // if(iObject.place){
        //   for (var i = 0; i < iObject.place.inventory.length; i++) {
        //     weight += iObject.place.inventory[i].weight;
        //   }
        // }

        weight += iObject.weight;
      }

      return weight.toFixed(2)
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
        style += "width: " + (this.activePlaceObj.width + 2) + "px; height: " + (this.activePlaceObj.height + 2) + "px;";
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .place-inventory{
    // display: flex;
    // flex-wrap: wrap;
    border: black 1px solid;
    // padding: 1rem;
    position: relative;
    overflow: visible;
    box-sizing: border-box;
  }
</style>
