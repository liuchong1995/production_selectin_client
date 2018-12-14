<template>
  <div style="padding:30px;">
    <keep-alive :include="cachedViews">
      <router-view :key="key"/>
    </keep-alive>
  </div>
</template>
<script>
  export default {
    name: 'constraint',
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      },
      key() {
        return this.$route.fullPath
      }
    }
  }
</script>
