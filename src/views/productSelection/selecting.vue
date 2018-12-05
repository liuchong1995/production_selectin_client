<template>
  <div class="custom-tree-container">
    <el-tree
      :data="data"
      :props="defaultProps"
      accordion
      @node-click="handleNodeClick">
    </el-tree>
  </div>
</template>

<script>
  export default {
    name: 'selecting',
    data() {
      return {
        treeData: [],
        defaultProps: {
          label: 'name',
          isLeaf: 'leaf',
          children: 'children'
        }
      }
    },
    methods: {
      loadTreeData(){
      }
    }
  }
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 20px;
    padding-right: 8px;
  }
</style>
