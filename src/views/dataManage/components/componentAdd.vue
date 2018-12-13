<template>
  <component-detail :is-edit="false"></component-detail>
</template>

<script>
  import ComponentDetail from './ComponentDetail'

  export default {
    name: 'componentAdd',
    components: { ComponentDetail }
  }
</script>
