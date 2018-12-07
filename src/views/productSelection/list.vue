<template>
    <div class="mixin-components-container">
        <el-row :gutter="20" style="margin-top:0px;">
            <el-col :span="4" v-for="product in productList" :key="product.productId">
                <el-card class="box-card">
                    <div slot="header" class="clearfix" style="text-align: center">
                        <span>{{product.productName}}</span>
                    </div>
                    <div class="component-item" @click.prevent="toSelect(product.productId)">
                        <pan-thumb width="220px" height="235px"
                                   :image="product.productImg">
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
        this.productList = response
      })
    },
    methods: {
      toSelect(productId){
        this.$router.push(`/selection/selecting/${productId}`)
      }
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
