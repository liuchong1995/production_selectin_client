<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 10px">
      <el-select v-model="orderSearchRequest.productId" placeholder="产品类型" clearable style="width: 250px"
                 class="filter-item"
                 size="small">
        <el-option :value="product.productId" :label="product.productName"
                   v-for="(product,index) in productList" :key="index"></el-option>
      </el-select>
      <el-input v-model="orderSearchRequest.costumer" placeholder="客户名称" style="width: 250px;" class="filter-item"
                size="small"/>
      <el-input v-model="orderSearchRequest.endUser" placeholder="最终用户" style="width: 250px;" class="filter-item"
                size="small"/>
      <el-select v-model="orderSearchRequest.creator" placeholder="制单人" clearable style="width: 100px" size="small"
                 class="filter-item">
        <el-option :value="user.username" :label="user.chineseName"
                   v-for="(user,index) in userList" :key="index"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-search" @click="getList">查询</el-button>
    </div>

    <el-table
      :data="orderListData.list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="编号" prop="id" align="center" width="280px">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品型号" align="center" width="350px">
        <template slot-scope="scope">
          <span>{{ scope.row.productModel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联单号" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.relateSellId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.customer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终用户" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.endUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制单人" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row.orderId)">详情</el-button>
          <el-button v-if="canModifyOrDelete(scope.row.creator)" size="mini" type="success"
                     @click="handleModify(scope.row.orderId)">修改
          </el-button>
          <el-button v-if="canModifyOrDelete(scope.row.creator)" size="mini" type="danger"
                     @click="handleDelete(scope.row.orderId)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="orderListData.total>0" :total="orderListData.total" :page.sync="listQuery.page"
                :limit.sync="listQuery.limit" @pagination="getList"/>

  </div>
</template>

<script>
  import { getList, deleteOrder } from '@/api/order'
  import { fetchList } from '@/api/product'
  import { getAllUsers } from '@/api/user'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'history',
    components: { Pagination },
    data() {
      return {
        orderListData: {
          total: 1
        },
        //分页配置
        listQuery: {
          page: 1,
          limit: 10
        },
        //查询请求
        orderSearchRequest: {
          productId: undefined,
          costumer: undefined,
          endUser: undefined,
          creator: undefined
        },
        productList: [],
        userList: []
      }
    },
    computed: {
      currentUserName() {
        return this.$store.getters.name
      }
    },
    created() {
      this.getList()
      this.loadDate()
    },
    methods: {
      canModifyOrDelete(owner) {
        return this.currentUserName === owner || this.currentUserName == 'admin'
      },
      async getList() {
        await setTimeout(() => {
        }, 10000)
        this.orderSearchRequest.page = this.listQuery.page
        this.orderSearchRequest.rows = this.listQuery.limit
        this.orderListData = await getList(this.orderSearchRequest)
      },
      async loadDate() {
        [this.productList, this.userList] = await Promise.all([fetchList(), getAllUsers()])
      },
      async handleDelete(orderId) {
        this.$confirm('您确定删除本条订单么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await deleteOrder(orderId)
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      },
      handleModify(orderId) {
        this.$router.push(`/selection/edit/${orderId}`)
      },
      handleDetail(orderId) {
        this.$router.push(`/selection/detail/${orderId}`)
      }
    }
  }
</script>
