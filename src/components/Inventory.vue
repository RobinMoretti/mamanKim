<template>
  <ul class="place-inventory">
    <p-object 
        :space="name"
        :object="object" 
        v-for="(object, key) in placeObjects"
        :key="key">      
    </p-object>
  </ul>
</template>

<script>
export default {
  props: {
    name: String,
  },
  methods: {
  },
  computed: {
    placeObjects: function () {
      return this.$store.state.places.places[this.name];
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .place-inventory{
    border: black 1px solid;
    padding: 1rem;
  }
</style>
