<template>
  <select-detail :is-edit="true"></select-detail>
</template>

<script>
  import SelectDetail from './components/SelectDetail'

  export default {
    name: 'editOrder',
    components: { SelectDetail }
  }
</script>
