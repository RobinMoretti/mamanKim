<template>
  <span class="object" :style="objectStyle" v-on:click="picked">
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
    inventorySpaceHeight: function(target){
      var height = 0;
      var maximunHeight = 0;
      var width = 0;
      var inventory = null;
      var place = null;

      if(target == "hands"){
        inventory = this.placesStore.player;
        place = this.handsObject;
      }else{
        inventory = this.placesStore.places[target].inventory;
        place = this.placesStore.places[target];
      }


      for (var i = 0; i < inventory.length; i++) {
        var iObject = {...this.objects[inventory[i].name]};
        iObject.width < 20 ? iObject.width = 20 : '';
        iObject.height < 20 ? iObject.height = 20 : '';
        // console.log("width = ", width);
        // console.log("iObject.width = ", iObject.width);
        // console.log("place.width = ", place.width);
        // console.log("place.width = ", place.width);
        // console.log("-------------------");


        if(width + iObject.width < place.width && i < inventory.length - 1){
          width += iObject.width;
          if(iObject.height > maximunHeight){
            maximunHeight = iObject.height;
          }
        }else{
          width = 0;
          height += maximunHeight;
          // console.log("maximunHeight = " + maximunHeight);
          // console.log("height = " + height);
          // console.log("-------------------");
          maximunHeight = 0;
        }
      }
      // console.log("height = " + height);
      //   console.log("-------------------");

      return height;
    },
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
    picked: function(){
      if(this.playMode == "picking"){
        console.log("object.name = " + this.object.name);
        console.log("this.$store.state.places.activePlace = " + this.$store.state.places.activePlace);
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
      console.log("this.inventoryMaximumWeight(target) = " + this.inventoryMaximumWeight(target));
      if(this.inventoryMaximumWeight(target) > 0){
        console.log("this.inventoryWeight(target) + this.detailObject.weight = " + (this.inventoryWeight(target) + this.detailObject.weight));
        console.log("this.inventoryMaximumWeight(target) = " + this.inventoryMaximumWeight(target));
        if((this.inventoryWeight(target) + this.detailObject.weight) <= this.inventoryMaximumWeight(target)){
          weightState = true;
        }
        else
          weightState = false;
      }
      else
        weightState = true;

      // space available ------------
      var heightAvailable = false;

      if(target == "hands"){
        var handHeight = this.placesStore.playerHeight;

        // console.log("handHeight = " + handHeight);
        if(this.inventorySpaceHeight(target) + this.detailObject.height <= handHeight){
          heightAvailable = true;
        }
      }else{
        var targetPlace = this.placesStore.places[target];

        if(targetPlace.infinite == true && targetPlace.scrollable == true ){
          heightAvailable = true;
        }else{
          if(this.inventorySpaceHeight(target) + this.detailObject.height <= targetPlace.height){
            heightAvailable = true;
          }
        }
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
    float: left;
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
