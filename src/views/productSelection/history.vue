<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 10px">
      <el-select v-model="orderSearchRequest.productId" placeholder="产品类型" clearable style="width: 250px"
                 class="filter-item"
                 size="small">
        <el-option :value="product.productId" :label="product.productName"
                   v-for="(product,index) in productList" :key="index"></el-option>
      </el-select>
      <el-input v-model="orderSearchRequest.productModel" placeholder="产品型号" style="width: 500px;" class="filter-item"
                size="small"/>
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
      <el-button v-permission="['admin']" class="filter-item" type="danger" size="small" icon="el-icon-delete" @click="deleteList">批量删除</el-button>
    </div>

    <el-table
      :data="orderListData.list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column fixed label="编号" prop="id" align="center" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品型号" align="center" width="480px">
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
      <el-table-column label="操作" fixed="right" align="center" width="420px" class-name="small-padding fixed-width" style="padding-left: 0;padding-right: 0">
        <template slot-scope="scope" style="margin-left: 0;margin-right: 0">
          <el-button type="primary" round size="mini" :loading="scope.row.status === 3"  @click="previewModel(scope.row)" style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px">{{scope.row.status | parseOrderStatus}}</el-button>
          <el-button v-show="scope.row.status === 2 || scope.row.status === 4" type="info" round size="mini" @click="regeneratePreviewModel(scope.row)" style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px">重新生成预览</el-button>
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
  import permission from '@/directive/permission' // 权限判断指令
  import { getList, deleteOrder, commitPreview, previewMsgUrl, deleteList } from '@/api/order'
  import { fetchList } from '@/api/product'
  import { getAllUsers } from '@/api/user'
  import Pagination from '@/components/Pagination'
  import SockJS from  'sockjs-client'
  import Stomp from 'stompjs'

  export default {
    directives: { permission },
    name: 'history',
    components: { Pagination },
    data() {
      return {
        stompClient:'',
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
          creator: undefined,
          productModel: undefined
        },
        productList: [],
        userList: [],
        multipleSelection: []
      }
    },
    computed: {
      currentUserName() {
        return this.$store.getters.name
      },
      selectedOrderIds(){
        return this.multipleSelection.map(ele => ele.orderId)
      }
    },
    created() {
      this.getList()
      this.loadDate()
      this.initWebSocket()
    },
    beforeDestroy () {
      this.disconnect()
    },
    methods: {
      async deleteList(){
        if (this.selectedOrderIds.length === 0) {
          return
        }
        this.$confirm(`您确定删除这${this.selectedOrderIds.length}个选型么, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await deleteList(this.selectedOrderIds)
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      initWebSocket() {
        this.connection();
      },
      connection() {
        let socket = new SockJS(previewMsgUrl)
        this.stompClient = Stomp.over(socket)
        this.stompClient.connect({'Access-Control-Allow-Origin': true},() => {
          console.log('websocket连接成功')
          this.stompClient.subscribe('/topic/cadres', (msg) => {
            console.log(msg) // msg.body存放的是服务端发送给我们的信息
            let cadRes = JSON.parse(msg.body)
            if (cadRes.code === 3){
              this.$notify.info({
                title: cadRes.order.orderNumber,
                dangerouslyUseHTMLString: true,
                message: `正在生成预览... <br/>${cadRes.order.productModel}`,
                duration: 0,
              })
            } else if (cadRes.code === 2){
              this.$notify.success({
                title: cadRes.order.orderNumber,
                dangerouslyUseHTMLString: true,
                message: `生成预览成功: <br/>${cadRes.order.productModel}`,
                duration: 0
              })
            } else if (cadRes.code === 4){
              this.$notify.error({
                title: cadRes.order.orderNumber,
                dangerouslyUseHTMLString: true,
                message: `生成预览失败！<br/>${cadRes.order.productModel}<br/>${cadRes.message}`,
                duration: 0
              })
            }
            this.getList()
          })
        });
      },
      disconnect() {
        if (this.stompClient) {
          this.stompClient.disconnect();
        }
      },
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
          this.getList()
          this.$notify.info({
            title: order.orderNumber,
            dangerouslyUseHTMLString: true,
            message: `<span>已提交生成预览:</span><br/><span>${order.productModel}</span>`
          })
        } else if (order.status === 2) {
          window.open(process.env.BASE_API + `/order/downloadPreview/${order.orderId}`, '_blank');
        } else if (order.status === 1) {
          this.$confirm('您确定再次提交生成预览么, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            await commitPreview(order.orderId)
            this.getList()
            this.$notify.info({
              title: order.orderNumber,
              dangerouslyUseHTMLString: true,
              message: `<span>已提交生成预览:</span><br/><span>${order.productModel}</span>`
            })
          })
        }
      },
      async regeneratePreviewModel(order){
        if (order.status === 2 || order.status === 4){
          await commitPreview(order.orderId)
          this.getList()
          this.$notify.info({
            title: order.orderNumber,
            dangerouslyUseHTMLString: true,
            message: `<span>已提交生成预览:</span><br/><span>${order.productModel}</span>`,
            duration: 0
          })
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
