<template>
  <div id="app">
    <div class="mains">
      Dans les mains:
      <inventory name="hands"></inventory>

  <!--     <div class="place-inventory">

        <p-object 
            space="hands"
            :object="object" 
            v-for="(object, key) in handsObjects"
            :key="key">      
        </p-object>

      </div>
 -->
    </div>

    <div class="spaces">
      <div>
        <router-link to="/vestibule">Vestibule</router-link>
      </div>
      <div>
        <router-link to="/salle-de-bain">Salle de bain</router-link>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.spaces{
  display: block;
  margin-bottom: 1rem;
}
</style>
