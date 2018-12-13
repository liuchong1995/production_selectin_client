<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 10px">
      <el-select v-model="compSearchRequest.productId" placeholder="产品类型" clearable style="width: 200px" size="small"
                 class="filter-item">
        <el-option :value="product.productId" :label="product.productName"
                   v-for="product in productList" :key="product.productId"></el-option>
      </el-select>
      <el-select v-model="compSearchRequest.firstCategoryId" placeholder="一级分类" clearable style="width: 200px"
                 size="small"
                 class="filter-item">
        <el-option :value="category.categoryId" :label="category.categoryName"
                   v-for="category in firstCategory" :key="category.categoryId"></el-option>
      </el-select>
      <el-select v-model="compSearchRequest.isDelete" placeholder="状态" clearable style="width: 100px" size="small"
                 class="filter-item">
        <el-option :value="false" label="未删除"></el-option>
        <el-option :value="true" label="已删除"></el-option>
      </el-select>
      <el-input v-model="compSearchRequest.componentModelNumber" placeholder="模型号" style="width: 350px;"
                class="filter-item"
                size="small"/>
      <el-button class="filter-item" type="info" size="small" icon="el-icon-search" @click="getList">查询</el-button>
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-plus" @click="$router.push(`/data/componentAdd`)">新增部件</el-button>
    </div>

    <el-table
      :data="compListData.list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="所属产品" prop="id" align="center" width="280px">
        <template slot-scope="scope">
          <span>{{ productShowList[scope.row.productId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部件名称" align="center" width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.componentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模型号" align="center" width="350px">
        <template slot-scope="scope">
          <span>{{ scope.row.componentModelNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部件短码" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.componentShortNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240px" class-name="small-padding fixed-width"
                       style="padding-left: 0;padding-right: 0">
        <template slot-scope="scope" style="margin-left: 0;margin-right: 0">
          <el-button size="mini" type="success"
                     style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px"
                     @click="$router.push(`/data/componentEdit/${scope.row.componentId}`)">修改
          </el-button>
          <el-button size="mini" type="danger"
                     style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px"
                     @click="handleDeleteOrRecovery(scope.row)">{{scope.row.isDeleted ? '恢复' : '删除'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="compListData.total>0" :total="compListData.total" :page.sync="listQuery.page"
                :limit.sync="listQuery.limit" @pagination="getList"/>

  </div>
</template>

<script>
  import { search, deleteOrRecovery} from '@/api/component'
  import { fetchList } from '@/api/product'
  import { getOneLevelCategory } from '@/api/category'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'componentManage',
    components: { Pagination },
    data() {
      return {
        compListData: {
          total: 1
        },
        //分页配置
        listQuery: {
          page: 1,
          limit: 10
        },
        //查询请求
        compSearchRequest: {
          productId: undefined,
          componentModelNumber: '',
          isDelete: false
        },
        productList: [],
        productShowList: [],
        firstCategory: []
      }
    },
    created() {
      this.getList()
      this.loadDate()
    },
    methods: {
      async getList() {
        this.compSearchRequest.page = this.listQuery.page
        this.compSearchRequest.rows = this.listQuery.limit
        this.compListData = await search(this.compSearchRequest)
      },
      async loadDate() {
        this.productList = await fetchList()
        for (const product of this.productList) {
          this.productShowList[product.productId] = product.productName
        }
      },
      handleModify() {

      },
      async handleDeleteOrRecovery(comp) {
        const msg = comp.isDeleted ? '恢复' : '删除';
        this.$confirm(`您确定${msg}这个部件么, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await deleteOrRecovery(comp.componentId)
          this.getList()
          this.$message({
            type: 'success',
            message: `${msg}成功!`
          })
        })

      }
    },
    watch: {
      'compSearchRequest.productId': async function(newVal) {
        if (newVal){
          const query = {
            productId: newVal,
            parentId: 0
          }
          this.firstCategory = await getOneLevelCategory(query)
        }
      }
    }
  }
</script>
