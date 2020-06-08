<template>
  <div :id="'inventory-' + name" class="inventory-component">
    <vue-custom-scrollbar
        class="place-inventory special"
        :class="{ error: error}"
        :id="name"
        :style="inventoryStyle"
        v-if="activePlaceObj.scrollable">
      <p-object
          :space="name"
          :object="object"
          v-for="(object, key) in placeObjects"
          :key="key">
      </p-object>

      <span class="fictif">f</span>

      <div class="top-available-hidder"
          v-if="topAvailable"
          :style="topAvailableStyle"></div>
    </vue-custom-scrollbar>

    <div class="place-inventory"
      :id="name"
      :style="inventoryStyle"
      :class="{ error: error }"
      v-else>
      <p-object
          :space="name"
          :object="object"
          v-for="(object, key) in placeObjects"
          :key="key">
      </p-object>

      <span class="fictif">f</span>

      <div class="top-available-hidder"
          v-if="topAvailable"
          :style="topAvailableStyle"></div>
    </div>

    <div class="informations">
      <p>{{$t("game.poid-maximum")}}: {{actualWeight}}/{{maximumWeight}}</p>
    </div>
  </div>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import EventBus from './../event-bus';

export default {
  components: {
    vueCustomScrollbar
  },
  data: function () {
   return {
    error: false
   }
  },
  props: {
    name: String,
    activePlaceObj: Object
  },
  computed: {
    topAvailableStyle: function(){
      return 'top:' + this.topAvailable.top + 'px; height:' + (this.activePlaceObj.height - this.topAvailable.top) + 'px';
    },
    topAvailable: function(){
      if(this.activePlaceObj.topAvailable != null){
        return this.activePlaceObj.topAvailable;
      }else {
        return false;
      }
    },
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
        style += "overflow-y: scroll !important;";
      }


      return style;
    },
    placeObjects: function () {
      if(this.name != "hands"){
        return this.$store.state.places.places[this.name].inventory;
      }
      else {
        return this.$store.state.places.player;
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

    EventBus.$on("FLASH_IVENTORY", (payLoad) => {
      // console.log("payLoad = " + payLoad);
      // console.log("payLoad = " + this.name);
      if(payLoad == this.name){
        console.log("FLASH_IVENTORY");
        this.error = true;

        setTimeout(()=>{
          this.error = false;
        }, 800);
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .inventory-component{
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none;
    *{
      -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
         -khtml-user-select: none; /* Konqueror HTML */
           -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none;
    }
  }
  .informations{
    p{
      margin-top: 10px;
      font-size: 12px;
      opacity: 0.8;
    }
  }

  .place-inventory{
    padding-top: 4px;
    // border: black 1px solid;
    // padding: 1rem;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    background-image: url("~@/assets/inventory-bg.svg");
    background-size: 20px;
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: flex-start;
    // background-clip: border-box;
    > div{
      display: inline-block;
      line-height: 0;
    }
    .fictif{
      opacity: 0;
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

      // pointer-events: none;
      // // margin-top: -4px !important;
      width: calc(100% - 5px); height: 20px;
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

      // position: relative;
    }

    .top-available-hidder{
      cursor: not-allowed !important;
      background: rgba(0,0,0,0.2);
      position: absolute;
      left: 0; top: 0;
      width: 100%;
    }
  }

  .error{
    animation-name: errorAnimation;
    animation-duration: infinite;
    animation-duration: 0.5s;
  }

  @keyframes errorAnimation {
    from {background-color: rgba(0,0,0,0);}
    to {background-color: #EE3711;}
  }

</style>
