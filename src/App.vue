<template>
  <div>
    <!-- Matomo Image Tracker-->
    <img src="https://matamo.robinmoretti.eu/matomo.php?idsite=2&amp;rec=1" alt="" style="border:0, position: absolute; left: -1000vw; top: -1000vw; opacity: 0;" />
    <!-- End Matomo -->

    <span class="cursor-icon" v-if="playMode == 'looking'">👁</span>
    <span class="cursor-icon" v-if="playMode == 'picking'">🖐</span>

    <transition-group name="fade">
      <div v-show="!loaded" key="1">Loading...</div>
      <div id="app" v-show="loaded" key="2">
        <div class="mains">
          <h3>{{ $t("game.mains") }}</h3>
          <inventory name="hands" :active-place-obj="handsObject"></inventory>
          <hr>
          <p class="play-mode">
            <span :class="playMode == 'looking' ? 'selected' : ''" v-on:click="changePlayMode('looking')">
              👁<p>{{$t("game.regarder")}}</p>
            </span>
            <span :class="playMode == 'picking' ? 'selected' : ''" v-on:click="changePlayMode('picking')">
              🖐<p>{{$t("game.prendre")}}</p>
            </span>
          </p>
          <p class="play-info" :class="{ hidden: !hideInfoMode }">Any key to switch</p>

          <iframe
            :src="tweeUrl"
            id="twee"
            ref="twee"
            @load="iframeLoaded"
            v-if="displayIframe"
            :class="{ 'orange-flash': flashIframe }">
          </iframe>
        </div>

        <vue-custom-scrollbar class="space">
          <transition name="fade">
            <div v-if="displayPlace && activePlaceObj && !endGame">
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
                  :class="{ 'locked': (placeStore.places[connection.place].locked || connection.condition != null && connection.condition == false || connection.available != null && connection.available == false), 'orange-flash': (connection.available != null && connection.available == true && placeStore.places[connection.place].locked == false) }">
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

        <vue-custom-scrollbar class="object-container" v-if="displayPlace && !endGame">
          <h3 v-if="activeObjectObj">{{activeObjectObj.name}}</h3>

          <p v-if="activeObjectObj">{{activeObjectObj.description}}</p>
        </vue-custom-scrollbar>

        <footer>
          <h1>{{ $t("app.app-name") }}</h1>
          -
          <transition name="fade">
            <p v-on:click="dResetGame" v-if="!displayResetGame"> {{ $t('game.recommencer') }}</p>
            <p v-else> <a href="#" v-on:click="resetGame">{{ $t('game.vraiment') }}</a> {{ $t('game.sauvegarde-supprime') }} </p>
          </transition>
          -
          <transition name="fade">
            <p v-if="!displayChangingLang" class="languages-container">
              {{ $t('lang.langues') }}
              <span class="languages">
                <a href="#" v-on:click="dChangingLang('fr')" :class="{ inactive: this.$i18n.locale == 'fr'}">{{ $t('lang.français') }}</a>
                <a href="#" v-on:click="dChangingLang('en')" :class="{ inactive: this.$i18n.locale == 'en'}">{{ $t('lang.anglais') }}</a>
              </span>
            </p>
            <p v-else>
              <a href="#" v-on:click="changingLang">{{ $t('game.vraiment') }}</a> {{ $t('game.sauvegarde-supprime') }}
            </p>
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
      displayLanguages: false,
      displayChangingLang: false,
      tweeUrl: "twee-build/index.html",
      displayIframe: false,
      loaded: false,
      lestKeyEvent: false,
      hideInfoMode: true,
      flashIframe: false,
      tempLang: null
    }
  },
  computed: {
    endGame: function(){
      // console.log("this.$store.getters = ", this.$store.getters['places/handsObject']);
      return this.$store.state.endGame;
    },
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
        this.displayResetGame = false;
      }, 3000);
    },
    dChangingLang: function(lang) {
      this.tempLang = lang;
      this.displayChangingLang = true;

      console.log("this.tempLang = " + this.tempLang);

      setTimeout(()=>{
        this.displayChangingLang = false;
        this.tempLang = null;
      }, 3000);
    },
    changingLang: function() {
      this.$store.dispatch("reset", false);
      var url = new URL(location.href);
      url.searchParams.set('lang', this.tempLang);
      location.href = url.href;
    },
    resetGame: function() {
      this.$store.dispatch("reset", true);
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
    },
    mouveCursorImgToCursor: function (event) {
      var el = document.getElementsByClassName("cursor-icon")[0];
      if(event.view.story != null){
        el.style.top = (event.clientY + this.$refs.twee.offsetTop) + "px";
        el.style.left = (event.clientX + this.$refs.twee.offsetLeft) + "px";

      }else{
        el.style.top = event.clientY + "px";
        el.style.left = event.clientX + "px";
      }
    },
    getKey:function (event) {
      // this.shiftKey = event.shiftKey;
      if(event.type != this.lestKeyEvent){

        this.hideInfoMode = false;

        this.hideInfoModeTimeOut = setTimeout(() => {
          this.hideInfoMode = true;
        }, 10000);

        this.$store.commit("togglePlayMode")
      }

      this.lestKeyEvent = event.type;
    },
    toggleFlashIframe:function () {
      console.log("flashIframe = -----------------");
      this.flashIframe = true;

      setTimeout(() => {
        this.flashIframe = false;
      }, 1000);
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

    document.getElementsByTagName("body")[0].addEventListener('mousemove', this.mouveCursorImgToCursor);

    this.$nextTick(() => {
      // window.flash = this.toggleFlashIframe;
      this.$refs.twee.contentWindow.flash = this.toggleFlashIframe;
      this.$refs.twee.contentWindow.flash();
      this.$refs.twee.contentWindow.addEventListener('mousemove', this.mouveCursorImgToCursor)
    })

    document.getElementsByTagName("body")[0].addEventListener('keyup', this.getKey)
    document.getElementsByTagName("body")[0].addEventListener('keydown', this.getKey)

    // document..on('keyup keydown', function(e){shifted = e.shiftKey} );
    // this.$refs.twee.addEventListener('mousemove', this.mouveCursorImgToCursor);
  }
};
</script>

<style lang="scss">
.cursor-icon{
  pointer-events: none;
  position: absolute;
  font-size: 20px;
  z-index: 100;
}

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
  width: 100vw;
  min-width: 900px;
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
  max-width: 1500px;
}

.space, .object-container{
  max-height: calc( 100vh - 50px );
  overflow-y: scroll;
  padding-right: 40px;
  display: inline-block !important;
  margin: 10px;
}

.mains{
  max-height: calc( 100vh - 70px );
  overflow-y: hidden;
  overflow-x: hidden;
  padding-right: 40px;
  display: inline-block !important;
  margin: 10px;
}

#twee{
  border: unset;
  width: calc(100% + 25px);
  height: calc( 100vh - 300px );
  margin-right: 20px;
  padding-right: 20px;
}

.space{
  flex-shrink: 0;
  min-width: 300px;
  width: 33%;
  max-width: 500px;
  margin-right: 20px;
  .description{
    width: 100%;
    line-height: 1.5;
  }
}

.object-container{
    flex-shrink: 1;
    // width: 300px;
    margin-left: 20px;
}

.iframe{
  width: 100%;
}
.mains{
  flex-shrink: 0;
  margin-right: 20px;
  min-width: 300px;
  width: 33%;
  max-width: 500px;
}

.play-mode{
  width: 100%;
  text-align: right;
  font-size: 20px;
  span{
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    margin: 2px;
    padding: 2px 5px;
    position: relative;

    p{
      opacity: 0;
      position: absolute;
      bottom: -25px;
      left: 0;
      color: rgba(0,0,0,0.5);
    }
  }

  span:hover{
    cursor: pointer;
    p{
      opacity: 1;
      font-size: 10px
    }
  }

  .selected{
    background-color: rgba(200,200,250, 0.2);
    border: 1px solid black;
  }
}

.play-info{
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  // opacity: 0;
  margin-top: -4px;
  font-size: 12px;
  text-align: right;
  width: 100%;
  color: rgba(0,0,0,0.5);
  pointer-events: none;
  // opacity: 0;
}

.places-available {
  display: flex;
  justify-content: flex-start;
  max-width: 300px;
  flex-wrap: wrap;

  button{
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    cursor: pointer;
    margin-top: 10px;
    background: rgba(0,0,0,0);
    border-radius: 0;
    border: 1px solid black;
    padding: 0.5rem 1rem;
    margin-right: 10px;
  }
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

.languages-container{
  .languages{
    width: 0;
    overflow: hidden;
    display: inline-block;
    position: relative;
    bottom: -3px;

    .inactive{
      opacity: 0.5;
      pointer-events: none;
    }

  }
}

.languages-container:hover{
  .languages{
    width: unset;
  }
}

.locked{
  cursor: not-allowed !important;
  // opacity: 0.3;
  background-color: rgba(0, 0, 0, 0.2) !important;
  border-color: rgba(0, 0, 0, 0.3) !important;
  color: rgba(0, 0, 0, 0.3) !important;
}

.orange-flash{
  animation-name: iframeAnimation;
  animation-duration: infinite;
  animation-duration: 0.5s;
}

@keyframes iframeAnimation {
  0% {background-color: rgba(0,0,0,0);}
  50% {background-color: #EEDB57;}
  100% {background-color: rgba(0,0,0,0);}
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
