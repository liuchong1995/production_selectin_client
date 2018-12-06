<template>
  <select-detail :is-edit="false"></select-detail>
</template>

<script>
  import SelectDetail from './components/SelectDetail'

  export default {
    name: 'selecting',
    components: { SelectDetail }
  }
</script>
