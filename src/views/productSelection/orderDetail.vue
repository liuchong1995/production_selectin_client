<template>
  <el-row id="printJS-form" style="padding: 20px" class="customInlineFrom">
    <el-col :span="21" style="font-size: 20px">KYOKUTOH产品选型: {{orderDetail.order.productModel}}</el-col>
    <el-col :span="3">
      <el-button size="small" type="primary" @click="print">打印</el-button>
      <el-button size="small" type="info" @click="fork">克隆</el-button>
      <el-button size="small" type="warning" @click="router.go(-1)">返回</el-button>
    </el-col>
    <el-form label-position="left" :inline="true" class="demo-form-inline">
      <el-col :span="8" style="height: 63px">
        <el-form-item label="订单号:" style="font-size: 18px">
          <span style="font-size: 18px">{{orderDetail.order.orderNumber}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="4" style="height: 63px">
        <el-form-item label="制单人:" style="font-size: 18px">
          <span style="font-size: 18px">{{orderDetail.order.creator}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="height: 63px">
        <el-form-item label="时间:" style="font-size: 18px">
          <span style="font-size: 18px">{{orderDetail.order.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="height: 63px">
        <el-form-item label="关联单号:" style="font-size: 18px">
          <span style="font-size: 18px">{{orderDetail.order.relateSellId}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="8" style="height: 63px">
        <el-form-item label="客户:" style="font-size: 18px">
          <span style="font-size: 18px">{{orderDetail.order.customer}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="4" style="height: 63px">
        <el-form-item label="最终用户:" style="font-size: 18px">
          <span style="font-size: 18px">{{orderDetail.order.endUser}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="height: 63px">
        <el-form-item label="安装高度:" style="font-size: 18px">
          <span style="font-size: 18px;height: 18px">{{orderDetail.order.mountHeight}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="6" style="height: 63px">
        <el-form-item label="架子高度:" style="font-size: 18px">
          <span style="font-size: 18px;height: 18px">{{orderDetail.order.shelfHeight}}</span>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="custom-card" style="margin:0;">
      <el-col :span="4" class="text-center" v-for="comp in orderDetail.components" :key="comp.componentId">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="text-align: center;font-size: 14px;padding:2px">
            <el-tooltip class="item" effect="light" :content="comp.componentName" placement="top-start"
                        :open-delay="300">
              <el-col :span="24" style="font-size: 20px">{{comp.componentName}}</el-col>
            </el-tooltip>
            <el-tooltip class="item" effect="light" :content="comp.componentModelNumber" placement="bottom-end"
                        :open-delay="300">
              <el-col :span="24" style="font-size: 16px;margin-top: 10px">{{comp.componentModelNumber}}</el-col>
            </el-tooltip>
          </div>
          <div class="component-item">
            <el-tooltip class="item" effect="light" :content="comp.componentReamrk" placement="top-start"
                        :open-delay="300">
              <pan-thumb width="230px" height="240px"
                         :image="comp.componentImage" @click.native="showDetailDialog(comp)">
              </pan-thumb>
            </el-tooltip>
          </div>
        </el-card>
      </el-col>
    </div>
    <el-dialog
      :title="currentComponentDetail.componentModelNumber"
      :visible.sync="centerDialogVisible"
      width="80%"
      center>
      <span v-html="currentComponentDetail.componentDetail"></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import PanThumb from '@/components/PanThumb/index'
  import { getOrderDetail } from '@/api/order'

  export default {
    name: 'orderDetail',
    components: { PanThumb },
    data() {
      return {
        centerDialogVisible: false,
        orderDetail: {
          order: {},
          components: []
        },
        currentComponentDetail: {},
        orderId: 0
      }
    },
    async mounted() {
      this.orderId = this.$route.params && this.$route.params.orderId
      let tempOrderDetail = await getOrderDetail(this.orderId)
      this.orderDetail.components = tempOrderDetail.components.sort((a, b) => a.componentId - b.componentId)
      this.orderDetail.order = tempOrderDetail.order
    },
    methods: {
      showDetailDialog(comp) {
        this.currentComponentDetail = comp
        this.centerDialogVisible = true
      },
      print() {
        let routeUrl = this.$router.resolve({
          path: `/selection/print/${this.orderId}`,
        });
        window.open(routeUrl .href, '_blank');
      },
      fork() {
        this.$router.push(`/selection/fork/${this.orderId}`)
      }
    }
  }
</script>

<style>
  .customInlineFrom .el-form-item__label {
    font-size: 16px;
  }

  .demo-form-inline {
    margin-top: 60px;
  }

  .custom-card .el-card__header {
    padding: 5px;
  }
</style>
