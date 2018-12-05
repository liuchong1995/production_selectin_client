<template>
  <div class="mixin-components-container">
    <el-row :gutter="20" style="margin-top:0px;">
      <el-col :span="4" v-for="product in productList" :key="product.productId">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="text-align: center">
            <span>{{product.productName}}</span>
          </div>
          <div class="component-item">
            <pan-thumb width="300px" height="300px"
                       :image="product.productImg">
            </pan-thumb>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
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
    computed: {
      ...mapGetters([
        'pictureUrl'
      ])
    },
    mounted() {
      fetchList().then(response => {
        this.productList = response.data
        this.productList.forEach(ele => ele.productImg = this.pictureUrl + ele.productImg)
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
