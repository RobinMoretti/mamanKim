<template>
  <div id="app">
    <div class="mains">
      <h3>Dans les mains</h3>
      <inventory name="hands" :width="50" :height="80"></inventory>
    </div>

    <div class="space">
      <h3>{{activePlaceName}}</h3>
      <inventory :name="activePlaceName" :width="activePlaceObj.width" :height="activePlaceObj.width"></inventory>

      <p>{{activePlaceObj.description}}</p>
  
      <div class="places-available">
        <button 
          v-for="connection in activePlaceObj.connections" 
          v-on:click="goToPlace(connection.place)">
            {{ connection.place }}
        </button>
      </div>
    </div>

    <div>
      <h3 class="hidden">v</h3>
      <iframe src="twee-build/index.html" id="twee" ref="twee"></iframe>
    </div>

    <div class="object">
      <h3 v-if="activeObjectObj">{{activeObjectName}}</h3>

      <p v-if="activeObjectObj">{{activeObjectObj.description}}</p>
    </div>

    <router-view></router-view>

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
    activePlaceObj: function(){
      var placeStore = this.$store.state.places;
      return placeStore.places[placeStore.activePlace];
    },
    activePlaceName: function(){
      var placeStore = this.$store.state.places;
      return placeStore.activePlace;
    },
    activeObjectObj: function(){
      var objectStore = this.$store.state.objects;
      return objectStore.objects[objectStore.activeObject];
    },
    activeObjectName: function(){
      var objectStore = this.$store.state.objects;
      return objectStore.activeObject;
    }
  },
  methods: {
    resetPlayer: function(){
      this.$store.commit("places/resetPlayer");
    },
    goToPlace: function(place){
      this.$store.dispatch("places/goTo", place);
    }
  },
  mounted: function(){
    this.$store.dispatch("places/init");
    this.$store.dispatch("objects/init");
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
#app {
  display: flex;
}

#twee{
  border: unset;
  width: 300px;
  height: 100vh;
  margin-right: 20px;

}

.space{
  width: 300px;
  margin-right: 20px;
}

.iframe{
  width: 100%;
}
.mains{
  margin-right: 20px;
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
