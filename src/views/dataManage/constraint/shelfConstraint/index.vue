<template>
  <el-form :model="shelfConstraintRequest" label-width="80px" style="padding: 30px;">
    <el-form-item label="产品类型">
      <el-select v-model="shelfConstraintRequest.productId" placeholder="请选择产品类型">
        <el-option v-for="(product,index) in productList" :key="index" :value="product.productId"
                   :label="product.productName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="安装方式">
      <el-select v-model="shelfConstraintRequest.installation" placeholder="请选择安装方式" value-key="categoryId">
        <el-option :value="installation.componentId" v-for="(installation,index) in installationList" :key="index"
                   :label="labelShow(installation.componentModelNumber,installation.componentShortNumber)"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关系">
      <el-radio-group v-model="shelfConstraintRequest.relation" size="small">
        <el-radio-button :label="1">架子高度大于安装高度</el-radio-button>
        <el-radio-button :label="2">架子高度等于安装高度</el-radio-button>
        <el-radio-button :label="3">架子高度小于安装高度</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="关系值" v-show="shelfConstraintRequest.relation !== 2">
      <el-input v-model="shelfConstraintRequest.relationValue" placeholder="关系值" style="width: 300px" type="number"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveShelfConstraint">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { getAllInstallation } from '@/api/shelf'
  import { addShelfConstraint } from '@/api/constraint'
  import { fetchList } from '@/api/product'

  export default {
    name: 'shelfConstraint',
    data() {
      return {
        productList: [],
        installationList: [],
        shelfConstraintRequest: {
          productId: undefined,
          installation: undefined,
          relation: 1,
          relationValue:undefined
        }
      }
    },
    mounted() {
      this.initPage()
    },
    methods: {
      async initPage() {
        this.productList = await fetchList()
      },
      async saveShelfConstraint() {
        this.$confirm('您确定增加这个架子约束么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await addShelfConstraint(this.shelfConstraintRequest)
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
        })
      },
      labelShow(modelNum,shortNum){
        return modelNum + ' ' + shortNum
      }
    },
    watch: {
      'shelfConstraintRequest.productId': async function(newVal) {
        this.installationList = await getAllInstallation(newVal)
        this.shelfConstraintRequest.installation = undefined
      },
      'shelfConstraintRequest.relation': function(newVal) {
        if (newVal === 2) {
          this.shelfConstraintRequest.relationValue = undefined
        }
      }
    }
  }
</script>

