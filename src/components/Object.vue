<template>
  <li v-on:click="picked" class="object">
    {{ object.name }} - {{ object.weight }}
  </li>
</template>

<script>
export default {
  props: {
    object: Object,
    space: {
      type: String,
    }
  },
  methods: {
    picked: function(){
      if (this.space != "hands") {
        this.$store.commit("places/removeObject", { place: this.space, object: this.object })
        this.$store.commit("places/addObject", { place: "hands", object: this.object })
      }else {
        this.$store.commit("places/removeObject", { place: "hands", object: this.object })
        this.$store.commit("places/addObject", { place: this.$route.name, object: this.object })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
