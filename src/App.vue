<template>
  <div>
    <transition-group name="fade">
      <div v-show="!loaded" key="1">Loading...</div>
      <div id="app"  v-show="loaded" key="2">
        <vue-custom-scrollbar class="mains">
          <h3>Dans les mains</h3>
          <inventory name="hands" :active-place-obj="handsObject"></inventory>
          <p class="play-mode">
            <span :class="playMode == 'looking' ? 'selected' : ''" v-on:click="changePlayMode('looking')">👁</span>
            <span :class="playMode == 'picking' ? 'selected' : ''" v-on:click="changePlayMode('picking')">🖐</span>
          </p>

          <hr>

          <iframe :src="tweeUrl" id="twee" ref="twee" @load="iframeLoaded" v-if="displayIframe"></iframe>
        </vue-custom-scrollbar>

        <vue-custom-scrollbar class="space">
          <transition name="fade">

            <div v-if="displayPlace && activePlaceObj">
              <h3 v-if="placeStore.places[activePlaceName]">{{ placeStore.places[activePlaceName].name }}</h3>

              <inventory
                :name="activePlaceName"
                :active-place-obj="activePlaceObj"
                v-if="activePlaceObj"
                ref="placeInventory"></inventory>

              <p class="description">{{activePlaceObj.description}}</p>

              <div class="places-available">
                <button
                  v-for="connection in activePlaceObj.connections"
                  v-on:click="goToPlace(connection.place, placeStore.places[connection.place], 'place')"
                  v-if="placeStore.places[connection.place]"
                  :class="{ 'locked': (placeStore.places[connection.place].locked || connection.condition != null && connection.condition == false || connection.available != null && connection.available == false) }">
                    {{ placeStore.places[connection.place].name }}
                </button>
                <div v-if="activePlaceObj.parentPlace">
                  <button
                      v-if="activePlaceObj.parentPlace != 'hands'"
                      v-on:click="goToPlace(activePlaceObj.parentPlace, placeStore.places[activePlaceObj.parentPlace])">
                      {{ placeStore.places[activePlaceObj.parentPlace].name }}
                  </button>
                  <button
                      v-else-if="activePlaceObj.parentPlace == 'hands'"
                      v-on:click="goToPlace(placeStore.lastActivePlace, placeStore.places[placeStore.lastActivePlace])">
                      {{ placeStore.places[placeStore.lastActivePlace].name }}
                  </button>
                </div>

              </div>
            </div>
          </transition>
        </vue-custom-scrollbar>

        <vue-custom-scrollbar class="object-container" v-if="displayPlace">
          <h3 v-if="activeObjectObj">{{activeObjectObj.name}}</h3>

          <p v-if="activeObjectObj">{{activeObjectObj.description}}</p>
        </vue-custom-scrollbar>

        <footer>
          <h1>Maman Kim</h1>
          -
          <a href="http://robinmoretti.eu">Robin Moretti</a>
          -
          <transition name="fade">
            <p v-on:click="dResetGame" v-if="!displayResetGame"> Recommencer</p>
            <p v-else> <a href="#" v-on:click="resetGame">vraiment ?</a> la sauvegarde vas être supprimé. </p>
          </transition>
        </footer>
      </div>

    </transition-group>
  </div>
</template>

<script>

import vueCustomScrollbar from 'vue-custom-scrollbar'
export default {
  components: {
    vueCustomScrollbar
  },
  name: 'App',
  data () {
    return {
      scrollbarSettings: {
        maxScrollbarLength: 60
      },
      displayResetGame: false,
      tweeUrl: "twee-build/index.html",
      displayIframe: false,
      loaded: false,
    }
  },
  computed: {
    saveId: function(){
      // console.log("this.$store.getters = ", this.$store.getters['places/handsObject']);
      return this.$store.state.saveId;
    },
    handsObject: function(){
      // console.log("this.$store.getters = ", this.$store.getters['places/handsObject']);
      return this.$store.getters['places/handsObject'] ;
    },
    playMode: function(){
      return this.$store.state.playMode;
    },
    placeStore: function(){
      return this.$store.state.places;
    },
    objectStore: function(){
      return this.$store.state.objects;
    },
    displayPlace: function(){
      return this.placeStore.displayPlace;
    },
    activePlaceObj: function(){
      return this.placeStore.places[this.placeStore.activePlace];
    },
    activePlaceName: function(){
      return this.placeStore.activePlace;
    },
    activeObjectObj: function(){
      if(this.objectStore.activeObject){
        return this.objectStore.objects[this.objectStore.activeObject];
      }
      else
        return false;
    },
    activeObjectName: function(){
      return this.objectStore.activeObject;
    }
  },
  methods: {
    iframeLoaded: function() {
      this.loaded = true;
      // this.$store.commit("toggleIframe", true);
    },
    dResetGame: function() {
      this.displayResetGame = true;
      setTimeout(()=>{
        this.displayResetGame = true;
      }, 3000);
    },
    resetGame: function() {
      this.$store.dispatch("reset");
    },
    resetPlayer: function(){
      this.$store.commit("places/resetPlayer");
    },
    goToPlace: function(place, placeObj, type = "object"){
      if(type == "place"){
        console.log(" this.placeConditionsValidate(place) = " +  this.placeConditionsValidate(place));
        if(placeObj.locked != true && this.placeConditionsValidate(place)){
          this.$store.dispatch("places/goTo", place);
        }
      }else{
        if(placeObj.locked != true){
          this.$store.dispatch("places/goTo", place);
        }
      }
    },
    changePlayMode: function(mode){
      this.$store.commit("changePlayMode", mode);
    },
    placeConditionsValidate: function(placeTargetName){

      var connections = this.activePlaceObj.connections.filter(connection =>{
        return connection.place == placeTargetName;
      });

      var connection = connections[0];

      // console.log("connections = ", connection);
      // console.log("connection = ", connection.condition == true);

      if(connection.condition == true || connection.condition == false){
        return connection.condition;
      }else{
        if(connection.available == true){
          return true;
        }else{
          return false;
        }
      }
      // if(connections.condition != true && connections.condition != false){
      //   if(connections.condition == "topAvailable"){
      //     console.log("offsettop = ", this.$refs.placeInventory.getElementsByClassName("fictif")[0].offsetTop);
      //     // if()
      //   }
      // }
    }
  },
  mounted: function(){
    setTimeout(()=>{
      this.$store.dispatch("objects/init");
      this.$store.dispatch("places/init");
      this.$store.dispatch("init");
    }, 300)


    if(this.$store.state.saveId){
      this.tweeUrl += "#" + this.$store.state.saveId;
    }

    this.displayIframe = true;
  }
};
</script>

<style lang="scss">
.hidden{
  visibility: hidden;
}

html, #twee{
  font-family: "PTSerif", serif;
  font-size: 15px;
  line-height: 1.5;
}
html, body{
  overflow: hidden;
}
body{
  height: 100vh;
  width: 1300px;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
}

#app {
  width: 100%;
  display: flex;
  // flex-direction: row;

  // // flex-basis: 300px;
  // justify-content: flex-start;
  // align-items: flex-start;
  // align-content: center;
  height: 100%;
  // border: grey solid 1px;
}


#app > div{
}

.space, .mains, .object-container{
  max-height: calc( 100vh - 50px );
  overflow-y: scroll;
  padding-right: 40px;
  display: inline-block !important;
  margin: 10px;
}

#twee{
  border: unset;
  width: 300px;
  height: calc( 100vh - 300px );
  margin-right: 20px;
}

.space{
  flex-shrink: 0;
  min-width: 300px;
  margin-right: 20px;
  .description{

    width: 300px;
    line-height: 1.5;
  }
}

.object-container{
    // width: 300px;
    margin-left: 20px;
}

.iframe{
  width: 100%;
}
.mains{
  flex-shrink: 0;
  margin-right: 20px;
  width: 300px;
}

.play-mode{
  span{
    margin: 2px;
    padding: 2px;
  }
  .selected{
    border: 1px solid black;
  }
}

.places-available button{
  background: rgba(0,0,0,0);
  border-radius: 0;
  border: 1px solid black;
  padding: 0.5rem 1rem;
  margin-right: 10px;
}

hr{
  margin-top: 20px;
  margin-bottom: 20px;
  opacity: 0.8;
}

footer{
  position: absolute;
  left: 0; bottom: 0;
  // width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: flex-end;
  padding: 10px;

  p, a{
    margin-right: 5px;
    margin-left: 5px;
    margin-top: 0;
    margin-bottom: 0;
  }

  h1{
    margin-right: 5px;
  }
  h1,a{
    font-size: 16px;
    margin-top: 0;
    margin-bottom: 0;
  }

  font-style: italic;
}
.locked{
  opacity: 0.3;
}
// fonts ---------------
@font-face {
  font-family: "PTSerif";
  src: url("~@/assets/fonts/PTSerif-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "PTSerif";
  src: url("~@/assets/fonts/PTSerif-Italic.ttf") format("truetype");
  font-weight: normal;
  font-style: italic;
}

@font-face {
  font-family: "PTSerif";
  src: url("~@/assets/fonts/PTSerif-Bold.ttf") format("truetype");
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: "PTSerif";
  src: url("~@/assets/fonts/PTSerif-BoldItalic.ttf") format("truetype");
  font-weight: bold;
  font-style: italic;
}

// annimation ---------------

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
