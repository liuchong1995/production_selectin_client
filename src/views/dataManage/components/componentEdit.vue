<template>
  <component-detail :is-edit="true"></component-detail>
</template>

<script>
  import ComponentDetail from './ComponentDetail'

  export default {
    name: 'componentEdit',
    components: { ComponentDetail }
  }
</script>
