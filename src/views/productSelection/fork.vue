<template>
  <select-detail :is-edit="true" :is-fork="true"></select-detail>
</template>

<script>
  import SelectDetail from './components/SelectDetail'
  export default {
    name: 'fork',
    components: { SelectDetail }
  }
</script>

<style scoped>

</style>
