<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 10px">
      <el-select v-model="currentProductId" placeholder="产品类型" clearable style="width: 200px"
                 size="small"
                 class="filter-item">
        <el-option :value="product.productId" :label="product.productName"
                   v-for="product in productList" :key="product.productId"></el-option>
      </el-select>
      <el-select v-show="currentProductId" value-key="categoryId" v-model="firstCategory" placeholder="一级分类" clearable style="width: 200px"
                 size="small"
                 class="filter-item">
        <el-option :value="category" :label="category.categoryName"
                   v-for="category in firstCategoryList" :key="category.categoryId"></el-option>
      </el-select>
      <el-select v-show="firstCategory && !firstCategory.isLeaf" value-key="categoryId" v-model="secondCategory" placeholder="二级分类" clearable style="width: 200px"
                 size="small"
                 class="filter-item">
        <el-option :value="category" :label="category.categoryName"
                   v-for="category in secondCategoryList" :key="category.categoryId"></el-option>
      </el-select>
      <el-select v-show="secondCategory && !secondCategory.isLeaf" value-key="categoryId" v-model="thirdCategory" placeholder="三级分类" clearable style="width: 200px"
                 size="small"
                 class="filter-item">
        <el-option :value="category" :label="category.categoryName"
                   v-for="category in thirdCategoryList" :key="category.categoryId"></el-option>
      </el-select>
      <el-select v-show="thirdCategory && !thirdCategory.isLeaf" value-key="categoryId"  v-model="forthCategory" placeholder="四级分类" clearable style="width: 200px"
                 size="small"
                 class="filter-item">
        <el-option :value="category" :label="category.categoryName"
                   v-for="category in forthCategoryList" :key="category.categoryId"></el-option>
      </el-select>
      <el-select v-show="componentList.length > 0" v-model="currentComponentId" placeholder="部件" clearable style="width: 200px"
                 size="small"
                 class="filter-item">
        <el-option :value="component.componentId" :label="component.componentModelNumber"
                   v-for="component in componentList" :key="component.componentId"></el-option>
      </el-select>
      <el-button class="filter-item" type="info" size="small" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button class="filter-item" type="danger" size="small" icon="el-icon-circle-close"
                 @click="handleDeleteList">批量删除
      </el-button>
    </div>

    <el-table
      :data="constraintListData.list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="是否删除" prop="id" align="center" width="150px">
        <template slot-scope="scope">
          <el-switch
            @change="handleDelIds(scope.row)"
            v-model="scope.row.isDeleted"
            active-color="#000000"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="约束所在产品" prop="id" align="center" width="280px">
        <template slot-scope="scope">
          <span>{{ productShowList[scope.row.productId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="约束组号" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="约束组名" align="center" width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="约束描述" align="center" width="600px">
        <template slot-scope="scope">
          <span>{{ scope.row.constraintDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding fixed-width"
                       style="padding-left: 0;padding-right: 0">
        <template slot-scope="scope" style="margin-left: 0;margin-right: 0">
          <el-button size="mini" type="danger"
                     style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px"
                     @click="handleDeleteRow(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="constraintListData.total>0" :total="constraintListData.total" :page.sync="listQuery.page"
                :limit.sync="listQuery.limit" @pagination="getList"/>

  </div>
</template>

<script>
  import { fetchList } from '@/api/product'
  import { search, deleteConstraint,deleteConstraints } from '@/api/constraint'
  import { getOneLevelCategory } from '@/api/category'
  import { getComponentByLastCate } from '@/api/component'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'constraintManage',
    components: { Pagination },
    data() {
      return {
        currentProductId: undefined,
        currentComponentId: undefined,
        firstCategoryList: [],
        secondCategoryList: [],
        thirdCategoryList: [],
        forthCategoryList: [],
        componentList: [],
        firstCategory: undefined,
        secondCategory: undefined,
        thirdCategory: undefined,
        forthCategory: undefined,

        constraintListData: {
          total: 1
        },
        //分页配置
        listQuery: {
          page: 1,
          limit: 10
        },
        //查询请求
        constraintSearchRequest: {
          productId: undefined,
          categoryIds: [],
          componentId: undefined
        },
        productList: [],
        productShowList: [],
        ids: [],
        changeComponentList: false
      }
    },
    mounted() {
      this.loadPage()
    },
    methods: {
      async loadPage() {
        this.constraintSearchRequest.page = this.listQuery.page
        this.constraintSearchRequest.rows = this.listQuery.limit;
        [this.constraintListData, this.productList] = await Promise.all([search(this.constraintSearchRequest), fetchList()])
        for (const product of this.productList) {
          this.productShowList[product.productId] = product.productName
        }
      },
      async getList() {
        //重新加载列表 数据
        await setTimeout(() => {
        }, 10000)
        this.constraintSearchRequest.categoryIds = []
        //切换页码
        this.constraintSearchRequest.page = this.listQuery.page
        this.constraintSearchRequest.rows = this.listQuery.limit
        this.constraintSearchRequest.productId = this.currentProductId
        if (this.currentComponentId) {
          this.constraintSearchRequest.componentId = this.currentComponentId
        }
        if (this.firstCategory) {
          this.constraintSearchRequest.categoryIds.push(this.firstCategory.categoryId)
        }
        if (this.secondCategory) {
          this.constraintSearchRequest.categoryIds.push(this.secondCategory.categoryId)
        }
        if (this.thirdCategory) {
          this.constraintSearchRequest.categoryIds.push(this.thirdCategory.categoryId)
        }
        if (this.forthCategory) {
          this.constraintSearchRequest.categoryIds.push(this.forthCategory.categoryId)
        }
        this.constraintListData = await search(this.constraintSearchRequest)
        this.ids.splice(0, this.ids.length);
      },
      handleDelIds(describe) {
        if (describe.isDeleted) {
          //如果是被选中,则增加到数组
          this.ids.push(describe.describeId)
        } else {
          let idx = this.ids.indexOf(describe.describeId)
          this.ids.splice(idx, 1)//删除
        }
      },
      async handleDeleteRow(row){
        this.$confirm('您确定删除这条约束么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await deleteConstraint(row.describeId)
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      },
      async handleDeleteList(){
        this.$confirm(`您确定删除这${this.ids.length}条约束么, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await deleteConstraints(this.ids)
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      },
      resetData(num){
        if (num === 6){

          if (this.firstCategory) {
            this.firstCategory = undefined
          }
          if (this.secondCategory) {
            this.secondCategory = undefined
          }
          if (this.thirdCategory) {
            this.thirdCategory = undefined
          }
          if (this.forthCategory) {
            this.forthCategory = undefined
          }
          if (this.currentComponentId) {
            this.currentComponentId = undefined
          }
          if (this.componentList.length > 0) {
            this.componentList = []
          }
        } else if (num === 5){
          if (this.secondCategory) {
            this.secondCategory = undefined
          }
          if (this.thirdCategory) {
            this.thirdCategory = undefined
          }
          if (this.forthCategory) {
            this.forthCategory = undefined
          }
          if (this.currentComponentId) {
            this.currentComponentId = undefined
          }
          if (this.componentList.length > 0) {
            this.componentList = []
          }
        } else if (num === 4){
          if (this.thirdCategory) {
            this.thirdCategory = undefined
          }
          if (this.forthCategory) {
            this.forthCategory = undefined
          }
          if (this.componentList.length > 0) {
            this.componentList = []
          }
          if (this.currentComponentId) {
            this.currentComponentId = undefined
          }
          if (this.componentList.length > 0) {
            this.componentList = []
          }
        } else if (num === 3){
          if (this.forthCategory) {
            this.forthCategory = undefined
          }
          if (this.currentComponentId) {
            this.currentComponentId = undefined
          }
          if (this.componentList.length > 0) {
            this.componentList = []
          }
        } else if (num === 1){
          if (this.currentComponentId) {
            this.currentComponentId = undefined
          }
        }
      }
    },
    watch: {
      'currentProductId': async function(newVal) {
        if (newVal) {
          const query = {
            productId: newVal,
            parentId: 0
          }
          this.firstCategoryList = await getOneLevelCategory(query)
        } else {
          this.currentProductId = undefined
        }
        this.resetData(6)
      },

      'firstCategory.categoryId': async function(newVal) {
        const tempNewVal = newVal
        if (newVal) {
          if (this.firstCategory.isLeaf) {
            this.changeComponentList = true
          } else {
            const query = {
              productId: this.currentProductId,
              parentId: newVal
            }
            this.secondCategoryList = await getOneLevelCategory(query)
          }
        }
        this.resetData(5)
        if (this.changeComponentList){
          if (tempNewVal){
            this.componentList = await getComponentByLastCate(tempNewVal)
          }
          this.changeComponentList = false
        }
      },

      'secondCategory.categoryId': async function(newVal) {
        const tempNewVal = newVal
        if (newVal) {
          if (this.secondCategory.isLeaf) {
            this.changeComponentList = true
          } else {
            const query = {
              productId: this.currentProductId,
              parentId: newVal
            }
            this.thirdCategoryList = await getOneLevelCategory(query)
          }
        }
        this.resetData(4)
        if (this.changeComponentList){
          if (tempNewVal){
            this.componentList = await getComponentByLastCate(tempNewVal)
          }
          this.changeComponentList = false
        }
      },

      'thirdCategory.categoryId': async function(newVal) {
        const tempNewVal = newVal
        if (newVal) {
          if (this.thirdCategory.isLeaf) {
            this.changeComponentList = true
          } else {
            const query = {
              productId: this.currentProductId,
              parentId: newVal
            }
            this.forthCategoryList = await getOneLevelCategory(query)
          }
        }
        this.resetData(3)
        if (this.changeComponentList){
          if (tempNewVal){
            this.componentList = await getComponentByLastCate(tempNewVal)
          }
          this.changeComponentList = false
        }
      },

      'forthCategory.categoryId': async function(newVal) {
        if (newVal) {
          this.componentList = await getComponentByLastCate(newVal)
        }
        this.resetData(1)
      }
    }
  }
</script>

