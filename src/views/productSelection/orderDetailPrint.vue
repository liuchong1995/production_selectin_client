<template>
    <el-row id="printJS-form" style="padding: 20px" class="customInlineFrom">
      <el-col :span="22" style="font-size: 20px">KYOKUTOH产品选型: {{orderDetail.order.productModel}}</el-col>
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
                <el-col :span="24" style="font-size: 20px">{{comp.componentName}}</el-col>
                <el-col :span="24" style="font-size: 16px;margin-top: 10px">CDK-BAYO-S01</el-col>
            </div>
            <div class="component-item">
                <pan-thumb width="275px" height="280px"
                           :image="comp.componentImage">
                </pan-thumb>
            </div>
          </el-card>
        </el-col>
      </div>
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
        currentComponentDetail: {}
      }
    },
    async mounted() {
      const orderId = this.$route.params && this.$route.params.orderId
      let tempOrderDetail = await getOrderDetail(orderId)
      this.orderDetail.components = tempOrderDetail.components.sort((a, b) => a.componentId - b.componentId)
      this.orderDetail.order = tempOrderDetail.order
      document.title = this.orderDetail.order.productModel
    },
    methods: {
      showDetailDialog(comp) {
        this.currentComponentDetail = comp
        this.centerDialogVisible = true
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
