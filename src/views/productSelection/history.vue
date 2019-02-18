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
      <el-input v-model="orderSearchRequest.endUser" placeholder="最终用户及项目号" style="width: 250px;" class="filter-item"
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
      <el-table-column label="编号" prop="id" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品型号" align="center" width="350px">
        <template slot-scope="scope">
          <span>{{ scope.row.productModel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联单号" align="center" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.relateSellId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.customer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终用户及项目号" align="center" width="199px">
        <template slot-scope="scope">
          <span>{{ scope.row.endUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="190px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制单人" align="center" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.creator | parseUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400px" class-name="small-padding fixed-width" style="padding-left: 0;padding-right: 0">
        <template slot-scope="scope" style="margin-left: 0;margin-right: 0">
          <el-button type="primary" round size="mini" :loading="scope.row.status === 1" @click="previewModel(scope.row)" style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px">{{scope.row.status | parseOrderStatus}}</el-button>
          <el-button v-show="scope.row.status === 2" type="info" round size="mini" @click="previewModel(scope.row)" style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px">重新生成预览</el-button>
          <el-button type="info" size="mini" @click="handleFork(scope.row.orderId)" style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px">克隆</el-button>
          <el-button type="primary" size="mini" @click="handleDetail(scope.row.orderId)" style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px">详情</el-button>
          <el-button v-if="canModifyOrDelete(scope.row.creator)" size="mini" type="success" style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px"
                     @click="handleModify(scope.row.orderId)">修改
          </el-button>
          <el-button v-if="canModifyOrDelete(scope.row.creator)" size="mini" type="danger" style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px"
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
  import { getList, deleteOrder, commitPreview, waitForFinish, downloadPreview } from '@/api/order'
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
        return this.currentUserName === owner || this.currentUserName === 'admin'
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
        this.$confirm('您确定删除这个选型么, 是否继续?', '提示', {
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
      async previewModel(order){
        if (order.status === 0){
          await commitPreview(order.orderId)
          //更新状态为已提交
          order.status = 1
          //等待生成完成
          await waitForFinish(order.orderId)
          //更新状态为已完成
          this.getList()
        } else if (order.status === 2) {
          window.open(`/order/downloadPreview/${order.orderId}`, '_blank');
        } else if (order.status === 3){
          await commitPreview(order.orderId)
          //更新状态为已提交
          order.status = 1
          //等待生成完成
          await waitForFinish(order.orderId)
          //更新状态为已完成
          this.getList()
        }
      },
      handleModify(orderId) {
        this.$router.push(`/selection/edit/${orderId}`)
      },
      handleDetail(orderId) {
        this.$router.push(`/selection/detail/${orderId}`)
      },
      handleFork(orderId) {
        this.$router.push(`/selection/fork/${orderId}`)
      }
    }
  }
</script>
