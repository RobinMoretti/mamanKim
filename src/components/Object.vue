<template>
  <span
      class="object"
      :class="objectClass"
      :id='space + "-" + object.name'
      :style="objectStyle"
      v-on:click="picked">
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

      if(this.$store.state.playMode == "picking" && this.detailObject.takable == false){
        style += "cursor: not-allowed;";
      }
      return style;
    },
    objectClass: function(){
      var classes = "";

      if(this.detailObject.takable != null && this.detailObject.takable == false){
        classes += " untakable";
      }

      return classes;
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
      var fictifDiv = document.querySelector("#" + (this.space == "hands" ? this.$store.state.places.activePlace : "hands" ) + " .fictif");

      fictifDiv.style.height = this.detailObject.height + "px";
      fictifDiv.style.width = this.detailObject.width + "px";

      if(this.playMode == "picking" || shift){

      console.log("picked = ");

        this.$nextTick(() => {
          // console.log('trying to take')
          if(this.object.name != this.$store.state.places.activePlace){
            if(this.detailObject.takable != null && this.detailObject.takable == false){
            }
            else{
              if (this.space != "hands") {
                if(this.objectIspackable("hands")){
                  this.$store.commit("places/removeObject", { place: this.space, object: this.object })
                  this.$store.commit("places/addObject", { place: "hands", object: this.object })
                  this.$nextTick(() => {
                    this.checkForSpecialEvent();
                  });
                }
              }else {
                if(this.objectIspackable(this.$store.state.places.activePlace)){
                  this.$store.commit("places/removeObject", { place: "hands", object: this.object })
                  this.$store.commit("places/addObject", { place: this.$store.state.places.activePlace, object: this.object });
                }
              }

              this.$store.dispatch('places/updatePlaceWeight', "hands");
              this.$store.dispatch('places/updatePlaceWeight', this.$store.state.places.activePlace);

              this.$nextTick(() => {
                this.$store.dispatch('places/updateConnectionsConditions');
              })
            }
          }
        });
      }else if(this.playMode == "looking"){
        this.displayObject();
      }
    },
    checkForSpecialEvent: function(){
      if(this.object.name == "bouteille-vide-de-biere-1" || this.object.name ==  "bouteille-vide-de-soju-1"){
        if(this.$store.state.objects.bouteilleTaken > 6){
          this.story().show("beaucoup de bouteilles vide");
        }
        this.$store.commit("objects/incrementBoutteilleTaker");
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

      if(this.detailObject.events && this.detailObject.events.length){
        var clickEvents = this.detailObject.events.filter((event) => {
          return event.name == "goPassage" && event.params.path == "click";
        })

        for (var i = 0; i < clickEvents.length; i++) {
          this.story().show(clickEvents[i].params.passage)
          // console.log(clickEvents[i].params.passage);
        }
      }
    },
    objectIspackable: function(target){
      // console.log("objectIspackable =  ------------/");
      // console.log('target', target)
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

      if(!weightState){
        this.flashError("weight", target);
      }

      console.log("check weight");

      // space available ------------

      var heightAvailable = true;
      var targetMaxHeight = target == "hands" ? 80 : this.placesStore.places[target].height;
      var targetMaxWidth = target == "hands" ? 80 : this.placesStore.places[target].width;
      // var objectWidth = "hands" ? 80 : this.placesStore.places[target].width;

      var fictifDiv = document.querySelector("#" + target + " .fictif");

      var fictifHeightOffset = fictifDiv.offsetTop - 4;

      if((fictifHeightOffset +  this.detailObject.height) >= targetMaxHeight){

        heightAvailable = false;
        // console.log("space error = ");
        this.flashError("space", target);

      }

      console.log("check space");

      var activePlaceIsNotAChildOfObject = true;

      if(target != "hands" && this.placesStore.places[target].parentPlace){
        activePlaceIsNotAChildOfObject = false;
        // if is no in the child
        var place = this.placesStore.places[this.object.name];

        // get the active place
        // go trgouht all parent and check if there is no active object

        var isChild = false;
        var level = 0;
        var index = 0;

        var activeObjectName = this.object.name;
        var getActivePlaceObject = this.placesStore.places[target];
        var getActivePlaceName = target;

        console.log("getActivePlaceObject = ", getActivePlaceObject);
        console.log("getActivePlaceObjectparentName = ", getActivePlaceObject.parentPlace);
        console.log("activeObjectName = ", activeObjectName);
        console.log("target = ", target);
        console.log("getActivePlaceName = ", getActivePlaceName);

        if(getActivePlaceObject.parentPlace && getActivePlaceObject.parentPlace != activeObjectName){
          while (getActivePlaceObject.parentPlace && getActivePlaceObject.parentPlace != activeObjectName) {
            // console.log("this!!! = ", getActivePlaceObject);
            getActivePlaceObject = this.placesStore.places[getActivePlaceObject.parentPlace];

            console.log("getActivePlaceObject.parentPlace = " + getActivePlaceObject.parentPlace);
            console.log("activeObjectName = " + activeObjectName);
            if(getActivePlaceObject.parentPlace != activeObjectName){
              activePlaceIsNotAChildOfObject = true;
            }
            else{
              activePlaceIsNotAChildOfObject = false;
              // console.log("Is Child error");
            }

            if(getActivePlaceObject.parentPlace == "hands"){
              break;
            }

          }
        }else {
          console.log("Is Child error");
          this.flashError("targetIsChild", { objectName: this.object.name, space: this.space, target: target });
        }


        console.log("check children stat = ");
      }


      console.log("weightState = " + weightState);
      console.log("heightAvailable = " + heightAvailable);
      console.log("activePlaceIsNotAChildOfObject = " + activePlaceIsNotAChildOfObject);

      if(weightState && heightAvailable && activePlaceIsNotAChildOfObject){
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
    vertical-align: top;

    position: relative;
    cursor: pointer;

    span{
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none;
      pointer-events: none;
      font-family: sans-serif;
      // font-weight: bold;
      position: absolute;
      left: 3px; top: 3px;
    }
  }

  .untakable{
    // cursor: not-allowed;
    background: #FFCA00;
  }
</style>
