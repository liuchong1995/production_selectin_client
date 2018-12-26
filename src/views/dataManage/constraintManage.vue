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
      <el-select v-show="Object.keys(firstCategory).length > 0 && !firstCategory.isLeaf" value-key="categoryId" v-model="secondCategory" placeholder="二级分类" clearable style="width: 200px"
                 size="small"
                 class="filter-item">
        <el-option :value="category" :label="category.categoryName"
                   v-for="category in secondCategoryList" :key="category.categoryId"></el-option>
      </el-select>
      <el-select v-show="Object.keys(secondCategory).length > 0 && !secondCategory.isLeaf" value-key="categoryId" v-model="thirdCategory" placeholder="三级分类" clearable style="width: 200px"
                 size="small"
                 class="filter-item">
        <el-option :value="category" :label="category.categoryName"
                   v-for="category in thirdCategoryList" :key="category.categoryId"></el-option>
      </el-select>
      <el-select v-show="Object.keys(thirdCategory).length > 0 && !thirdCategory.isLeaf" value-key="categoryId"  v-model="forthCategory" placeholder="四级分类" clearable style="width: 200px"
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
      <el-table-column label="是否删除" prop="id" align="center" width="80px">
        <template slot-scope="scope">
          <el-switch
            @change="handleDelIds(scope.row)"
            v-model="scope.row.isDeleted"
            active-color="#000000"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="约束所在产品" prop="id" align="center" width="220px">
        <template slot-scope="scope">
          <span>{{ productShowList[scope.row.productId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="约束组号" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="约束组名" align="center" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="约束描述" align="center" width="1000px">
        <template slot-scope="scope">
          <span>{{ scope.row.constraintDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width"
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
        firstCategory: {},
        secondCategory: {},
        thirdCategory: {},
        forthCategory: {},

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
        this.constraintSearchRequest.componentId = this.currentComponentId
        if (Object.keys(this.firstCategory).length > 0) {
          this.constraintSearchRequest.categoryIds.push(this.firstCategory.categoryId)
        }
        if (Object.keys(this.secondCategory).length > 0) {
          this.constraintSearchRequest.categoryIds.push(this.secondCategory.categoryId)
        }
        if (Object.keys(this.thirdCategory).length > 0) {
          this.constraintSearchRequest.categoryIds.push(this.thirdCategory.categoryId)
        }
        if (Object.keys(this.forthCategory).length > 0) {
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
          this.firstCategoryList = []
        }
        //清空各种分类
        this.secondCategoryList = []
        this.thirdCategoryList = []
        this.forthCategoryList = []
        this.componentList = []
        this.firstCategory = {}
        this.secondCategory = {}
        this.thirdCategory = {}
        this.forthCategory = {}
        this.currentComponentId = undefined
      },

      'firstCategory.categoryId': async function(newVal) {
        if (newVal) {
          if (!this.firstCategory.isLeaf) {
            const query = {
              productId: this.currentProductId,
              parentId: newVal
            }
            this.secondCategoryList = await getOneLevelCategory(query)
            this.componentList = []
          } else {
            this.secondCategoryList = []
            this.componentList = await getComponentByLastCate(newVal)
          }
        } else {
          this.componentList = []
        }
        this.thirdCategoryList = []
        this.forthCategoryList = []
        this.secondCategory = {}
        this.thirdCategory = {}
        this.forthCategory = {}
        this.currentComponentId = undefined
      },

      'secondCategory.categoryId': async function(newVal) {
        if (newVal) {
          if (!this.secondCategory.isLeaf) {
            const query = {
              productId: this.currentProductId,
              parentId: newVal
            }
            this.thirdCategoryList = await getOneLevelCategory(query)
            this.componentList = []
          } else {
            this.thirdCategoryList = []
            this.componentList = await getComponentByLastCate(newVal)
          }
        } else {
          this.componentList = []
        }
        this.forthCategoryList = []
        this.thirdCategory = {}
        this.forthCategory = {}
        this.currentComponentId = undefined
      },

      'thirdCategory.categoryId': async function(newVal) {
        if (newVal) {
          if (!this.thirdCategory.isLeaf) {
            const query = {
              productId: this.currentProductId,
              parentId: newVal
            }
            this.forthCategoryList = await getOneLevelCategory(query)
            this.componentList = []
          } else {
            this.forthCategoryList = []
            this.componentList = await getComponentByLastCate(newVal)
          }
        } else {
          this.componentList = []
        }
        this.forthCategory = {}
        this.currentComponentId = undefined
      },

      'forthCategory.categoryId': async function(newVal) {
        if (newVal) {
          this.componentList = await getComponentByLastCate(newVal)
        } else {
          this.componentList = []
        }
        this.currentComponentId = undefined
      }
    }
  }
</script>

