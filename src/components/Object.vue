<template>
  <span class="object" :id='space + "-" + object.name' :style="objectStyle" v-on:click="picked">
    <span v-html="detailObject.picto" v-if="objects != null && object"></span>
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
    handsObject: function(){
      return this.$store.getters['places/handsObject'] ;
    },
    placesStore: function(){
      return this.$store.state.places;
    },
    objects: function(){
      return this.$store.state.objects.objects;
    },
    detailObject: function(){
      return this.objects[this.object.name];
    },
    playMode: function(){
      return this.$store.state.playMode;
    },
    objectStyle: function(){
      var width = this.detailObject.width;
      var height = this.detailObject.height;

      if(width < 20){
        width = 20;
      }

      if(height < 20){
        height = 20;
      }

      var style = "width:" + width + "px;";
      style += "height:" + height + "px;";
      return style;
    },
  },
  methods: {
    inventoryMaximumWeight: function(target){
      if(target == "hands"){
        return this.placesStore.playerMaximunWeight;
      }else{
        if(this.placesStore.places[target].maximumWeight){
          return this.placesStore.places[target].maximumWeight;
        }else {
          return 0;
        }
      }
    },
    inventoryWeight: function(target){
      var inventory = null;
      var weight = 0;

      if(target == "hands"){
        weight = this.placesStore.playerActualWeight;
      }else{
        weight = this.placesStore.places[target].actualWeight;
      }

      return weight;
    },
    deleteObject: function(){
      if (this.space != "hands") {
        this.$store.commit("places/removeObject", { place: this.space, object: this.object })
      }else {
        this.$store.commit("places/removeObject", { place: "hands", object: this.object })
      }
    },
    picked: function(event, shift = false){
      console.log(shift)
      if(this.playMode == "picking" || shift){
        if(this.object.name != this.$store.state.places.activePlace){
          if (this.space != "hands") {
            if(this.objectIspackable("hands")){
              this.$store.commit("places/removeObject", { place: this.space, object: this.object })
              this.$store.commit("places/addObject", { place: "hands", object: this.object })
            }
          }else {
            console.log("this.$store.state.places.activePlace = " + this.$store.state.places.activePlace);
            if(this.objectIspackable(this.$store.state.places.activePlace)){
              this.$store.commit("places/removeObject", { place: "hands", object: this.object })
              this.$store.commit("places/addObject", { place: this.$store.state.places.activePlace, object: this.object });
            }
          }

          this.$store.dispatch('places/updatePlaceWeight', "hands");
          this.$store.dispatch('places/updatePlaceWeight', this.$store.state.places.activePlace);
        }

      }else if(this.playMode == "looking"){
        this.displayObject();
      }
    },
    displayObject: function(){
      if(this.detailObject.place){
        if(this.placesStore.places[this.object.name]){
            this.$store.dispatch("places/goTo", this.object.name);
        }
      }else{
        this.$store.commit("objects/setActiveObject", this.object);
      }
    },
    objectIspackable: function(target){
      // weight available ------------
      var weightState = false;
      if(this.inventoryMaximumWeight(target) > 0){
        if((this.inventoryWeight(target) + this.detailObject.weight) <= this.inventoryMaximumWeight(target)){
          weightState = true;
        }
        else
          weightState = false;
      }
      else
        weightState = true;

      // space available ------------

      var heightAvailable = true;
      var targetMaxHeight = target == "hands" ? 80 : this.placesStore.places[target].height;
      var targetMaxWidth = target == "hands" ? 80 : this.placesStore.places[target].width;
      // var objectWidth = "hands" ? 80 : this.placesStore.places[target].width;
      var fictifHeightOffset = document.querySelector("#" + target + " .fictif").offsetTop - 4;

      console.log(fictifHeightOffset)
      console.log(fictifHeightOffset)
      if(fictifHeightOffset + this.detailObject.height >= targetMaxHeight){
        heightAvailable = false;  
      }

      if(weightState && heightAvailable){
        return true;
      }
      return false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .object{
    background: white;
    // float: left;
    // position: relative;
    // bottom: 10px;
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

    span{
      position: absolute;
      left: 1px; top: 1px;
    }
  }
</style>
