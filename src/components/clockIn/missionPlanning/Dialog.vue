<template>
  <div id="Dialog">


  </div>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    dialogVisible:Boolean
  },
  data() {
    return {

    };
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    }
  }
};
</script>

<style scoped>

</style>
