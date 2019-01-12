<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="普通约束"  name="commonConstraint">
        <keep-alive>
          <common-constraint></common-constraint>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="复杂必选约束"  name="advanceMandatoryConstraint">
        <keep-alive>
          <advance-mandatory-constraint></advance-mandatory-constraint>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane label="架子约束" name="shelfConstraint">
        <keep-alive>
          <shelf-constraint></shelf-constraint>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import commonConstraint from './commonConstraint'
  import advanceMandatoryConstraint from './advanceMandatoryConstraint'
  import shelfConstraint from './shelfConstraint'

  export default {
    name: 'constraint',
    components: {
      commonConstraint,
      advanceMandatoryConstraint,
      shelfConstraint
    },
    data() {
      return {
        activeName: 'commonConstraint'
      }
    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
