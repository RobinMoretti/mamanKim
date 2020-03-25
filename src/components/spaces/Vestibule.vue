<template>
  <div>
    Vestibule
    <inventory name="vestibule"></inventory>
  </div>
</template>

<script>
export default {
	props: {

	},
	computed: {
	},
	mounted: function(){
		// console.log(this.twee)
		this.story.show("Vestibule");
	}
}
</script>

<style lang="scss">

</style>
