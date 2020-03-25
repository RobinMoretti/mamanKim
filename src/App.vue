<template>
  <div id="app">
    <div class="mains">
      <h3>Dans les mains</h3>
      <inventory name="hands" :active-place-obj="handsObject"></inventory>
      <p class="play-mode">
        <span :class="playMode == 'looking' ? 'selected' : ''" v-on:click="changePlayMode('looking')">👁</span>
        <span :class="playMode == 'picking' ? 'selected' : ''" v-on:click="changePlayMode('picking')">🖐</span>
      </p>

      <hr>

      <iframe src="twee-build/index.html" id="twee" ref="twee"></iframe>
    </div>

    <div class="space">
      <div v-if="displayPlace && activePlaceObj">
        <h3>{{activePlaceName}}</h3>
        <inventory :name="activePlaceName" :active-place-obj="activePlaceObj" v-if="activePlaceObj"></inventory>

        <p class="description">{{activePlaceObj.description}}</p>

        <div class="places-available">
          <button
            v-for="connection in activePlaceObj.connections"
            v-on:click="goToPlace(connection.place)">
              {{ connection.place }}
          </button>
        </div>
      </div>
    </div>

    <div class="object">
      <h3 v-if="activeObjectObj">{{activeObjectObj.name}}</h3>

      <p v-if="activeObjectObj">{{activeObjectObj.description}}</p>
    </div>

    <!-- <router-view></router-view> -->

   <!--  <div class="options">
      <button v-on:click="resetPlayer">resetPlayer</button>
    </div> -->
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  computed: {
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
    resetPlayer: function(){
      this.$store.commit("places/resetPlayer");
    },
    goToPlace: function(place){
      this.$store.dispatch("places/goTo", place);
    },
    changePlayMode: function(mode){
      this.$store.commit("changePlayMode", mode);
    }
  },
  mounted: function(){
    setTimeout(()=>{
      this.$store.dispatch("places/init");
      this.$store.dispatch("objects/init");
      this.$store.dispatch("init");
    }, 300)
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
}

body{
  height: 100vh;
  width: 1300px;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: hidden;
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
  border: grey solid 1px;
}

#app > div{
  display: inline-block !important;
  margin: 10px;
}

#twee{
  border: unset;
  width: 300px;
  height: 100vh;
  margin-right: 20px;

}

.space{
  min-width: 300px;
  margin-right: 20px;
  .description{

    width: 300px;
  }
}

.object{

    width: 300px;
}

.iframe{
  width: 100%;
}
.mains{
  margin-right: 20px;
  width: 300px;
}

.play-mode{
  span{
    margin: 2px;
  }
  .selected{
    border: 1px solid black;
  }
}

// fonts
@font-face {
  font-family: "PTSerif";
  src: url("/fonts/PTSerif-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "PTSerif";
  src: url("/fonts/PTSerif-Italic.ttf") format("truetype");
  font-weight: normal;
  font-style: italic;
}

@font-face {
  font-family: "PTSerif";
  src: url("/fonts/PTSerif-Bold.ttf") format("truetype");
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: "PTSerif";
  src: url("/fonts/PTSerif-BoldItalic.ttf") format("truetype");
  font-weight: bold;
  font-style: italic;
}
</style>
