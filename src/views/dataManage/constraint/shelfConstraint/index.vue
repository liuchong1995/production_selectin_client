<template>
  <el-row>
    <el-form :inline="true" label-width="80px" style="padding: 10px 0 0 0;">
      <el-form-item label="产品类型">
        <el-select v-model="currentProduct.productId" placeholder="请选择产品类型" style="width: 300px">
          <el-option v-for="(product,index) in productList" :key="index" :value="product.productId"
                     :label="product.productName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="架子组件">
        <el-select v-model="currentShelfId" placeholder="请选择架子组件">
          <el-option :value="shelf.componentId" v-for="(shelf,index) in shelfList" :key="index"
                     :label="shelf.componentModelNumber"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="click-table4-oper" v-show="currentShelfId">
      <el-button type="success" size="mini" @click="insertEvent">新增</el-button>
      <el-button type="danger" size="mini" @click="deleteSelectedEvent">删除选中</el-button>
      <el-button type="info" size="mini" @click="saveConstraint">保存</el-button>
    </div>

    <elx-editable
      ref="elxEditable"
      class="click-table4"
      border
      size="large"
      :row-class-name="tableRowClassName"
      :data.sync="curShelfConstraintList"
      :edit-config="{trigger: 'click', mode: 'row', useDefaultValidTip: true}"
      style="width: 100%">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column prop="height" label="架子高度" min-width="160"
                           :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
      <elx-editable-column prop="inst" label="安装方式" min-width="160"
                           :edit-render="{name: 'ElSelect', options: installationList, optionProps: {label: 'componentModelNumber', value: 'componentId'}}"></elx-editable-column>
      <elx-editable-column prop="minMountedHeight" label="最小安装高度" min-width="160"
                           :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
      <elx-editable-column prop="maxMountedHeight" label="最高安装高度" min-width="160"
                           :edit-render="{name: 'ElInputNumber'}"></elx-editable-column>
    </elx-editable>
  </el-row>
</template>

<script>
  import { getAllShelf, getConstraint } from '@/api/component'
  import { fetchList } from '@/api/product'
  import { getAllInstallation, save } from '@/api/shelf'

  export default {
    name: 'shelfConstraint',
    data() {
      return {
        productList: [],
        currentProduct: {},
        shelfList: [],
        currentShelfId: undefined,
        curShelfConstraintList: [],
        installationList: []
      }
    },
    mounted() {
      this.initPage()
    },
    methods: {
      async initPage() {
        this.productList = await fetchList()
      },
      removeEvent (row) {
        console.log(row)
      },
      tableRowClassName ({ row, rowIndex }) {
      },
      insertEvent () {
        this.curShelfConstraintList.unshift({})
      },
      deleteSelectedEvent () {
        let removeRecords = this.$refs.elxEditable.getSelecteds()
        this.curShelfConstraintList = this.curShelfConstraintList.concat(removeRecords).filter(v => this.curShelfConstraintList.includes(v) && !removeRecords.includes(v))
      },
      async saveConstraint() {
        let toSaveData = JSON.parse(JSON.stringify(this.curShelfConstraintList))
        toSaveData.forEach(ele => {
          if (ele.inst) {
            ele.inst = [ele.inst]
          } else {
            ele.inst = []
          }
        })
        this.$confirm('您确定保存这条约束么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await save({heights:JSON.stringify(toSaveData),bracketId:this.currentShelfId})
          this.$message("保存成功!")
          this.curShelfConstraintList = await getConstraint(this.currentShelfId)
          this.curShelfConstraintList.forEach(ele => ele.inst = ele.inst[0])
        })

      }
    },
    watch: {
      'currentProduct.productId': async function(newVal) {
        [this.shelfList, this.installationList] = await Promise.all([getAllShelf(newVal), getAllInstallation(newVal)])
        this.currentShelfId = undefined
        this.curShelfConstraintList = []
      },
      currentShelfId: async function(newVal) {
        if (newVal) {
          this.curShelfConstraintList = await getConstraint(newVal)
          this.curShelfConstraintList.forEach(ele => ele.inst = ele.inst[0])
        }
      }
    }
  }
</script>

<style scoped>
  .click-table4-oper {
    margin-bottom: 18px;
  }

  .click-table4 .delete-row {
    color: #f56c6c;
    text-decoration: line-through;
  }

  .click-table4.elx-editable .elx-editable-row.new-insert,
  .click-table4.elx-editable .elx-editable-row.new-insert:hover > td {
    background-color: #f0f9eb;
  }
</style>
