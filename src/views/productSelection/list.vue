<template>
  <div class="mixin-components-container">
    <el-row :gutter="20" style="margin-top:50px;">
      <el-col :span="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>图片hover效果</span>
          </div>
          <div class="component-item">
            <pan-thumb width="100px" height="100px"
                       image="https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191">
              vue-element-admin
            </pan-thumb>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PanThumb from '@/components/PanThumb'
  import { fetchList } from '@/api/product'

  export default {
    name: 'list',
    components: {
      PanThumb
    },
    data() {
      return {
        productList: []
      }
    },
    mounted() {
      fetchList().then(response => {
        this.productList = response.data.data
      })
    }
  }
</script>

<style scoped>
  .mixin-components-container {
    background-color: #f0f2f5;
    padding: 30px;
    min-height: calc(100vh - 84px);
  }

  .component-item {
    min-height: 100px;
  }
</style>
