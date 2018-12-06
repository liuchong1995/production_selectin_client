<template>
  <el-row>
    <el-dialog
      title="部件详情"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>{{currentComponentDetail}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <el-col class="custom-tree-container" :span="3">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :highlight-current="true"
        accordion
        @node-click="handleNodeClick"
        style="width: 200px;margin-top: 10px">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
      </span>
      </el-tree>
    </el-col>
    <el-col class="mixin-components-container" :span="21">
      <el-row>
        <el-card id="selectedList" class="box-card" body-style="padding:0;">
          <div slot="header" class="clearfix">
            <span :span="2">已选列表</span>
          </div>
          <div>
            <el-form :inline="true" style="height: 48px;padding-top: 4px">
              <el-form-item label="产品型号" style="padding-left:15px">
                <el-input style="width: 300px" size="small" placeholder="产品型号" disabled></el-input>
              </el-form-item>
              <el-form-item label="关联单号">
                <el-input style="width: 200px" size="small" placeholder="关联单号"></el-input>
              </el-form-item>
              <el-form-item label="客户名称">
                <el-input style="width: 200px" size="small" placeholder="客户名称"></el-input>
              </el-form-item>
              <el-form-item label="最终用户">
                <el-input style="width: 200px" size="small" placeholder="最终用户"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="success" size="small">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="custom-card" style="margin:0;">
            <el-col :span="3" class="text-center">
              <el-card class="box-card">
                <div slot="header" class="clearfix" style="text-align: center;font-size: 14px;padding:2px">
                  <el-col :span="21">电动单面修磨机</el-col>
                  <el-col :span="21">CDK-R-S07-CD-R-S07</el-col>
                  <svg-icon style="font-size: 18px;cursor: pointer;" icon-class="delete" @click.native="deleteChoice"/>
                </div>
                <div class="component-item">
                  <pan-thumb width="170px" height="180px"
                             image="src/assets/test_image/robot.jpg">
                  </pan-thumb>
                </div>
              </el-card>
            </el-col>

          </div>
        </el-card>
      </el-row>
      <el-row>
        <el-card id="toSelect" class="box-card" body-style="padding:0">
          <div slot="header" class="clearfix">
            <span>可选列表</span>
          </div>
          <div class="custom-card" style="margin:0;">
            <el-col :span="3" class="text-center" v-for="comp in optionalList" :key="comp.componentId">
              <el-card class="box-card">
                <div class="component-item">
                  <el-tooltip class="item" effect="dark" :content="comp.componentReamrk" placement="top-start">
                    <pan-thumb width="170px" height="180px"
                               :image="comp.componentImage" @click.native="showDetailDialog(comp.componentDetail)">
                    </pan-thumb>
                  </el-tooltip>
                </div>
                <el-tooltip class="item" effect="light" :content="comp.componentModelNumber" placement="bottom-end">
                  <el-button type="primary" class="ellipsis" size="small" style="width: 100%;padding: 9px 5px">
                    {{comp.componentModelNumber}}
                  </el-button>
                </el-tooltip>
              </el-card>
            </el-col>
          </div>
        </el-card>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import { getMenuTree } from '@/api/category'
  import { getAllHeight, getAllMountHeight, getShelfConstraint, getAllInstallation } from '@/api/shelf'
  import { getOptionalListByCateId, getOptionalListBySelected } from '@/api/component'
  import PanThumb from '@/components/PanThumb/index'

  export default {
    name: 'SelectDetail',
    components: { PanThumb },
    data() {
      return {
        centerDialogVisible: false,
        treeData: [],
        defaultProps: {
          label: 'categoryName',
          isLeaf: 'isLeaf',
          children: 'children'
        },
        //重构菜单树请求
        refactorTreeRequest: {},
        //获取可选列表请求
        optionalListBySelectedRequest: {},
        //当前附件列表
        currantAttachment: [],
        //已选组件列表
        selectedList: [],
        //已选类型列表
        selectedTypeList: [],
        //订单实体，用于提交保存
        orderEntity: {},
        //所有架子及对应的高度
        allShelfHeight: {},
        //所有安装高度
        allMountHeight: [],
        //所有架子约束
        allShelfConstraint: [],
        //所有安装方式
        allInstallation: [],
        //待选列表
        optionalList: [],
        //当前部件详情
        currentComponentDetail: ''

      }
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      const prdId = this.$route.params && this.$route.params.productId
      this.loadTreeData(prdId)
    },
    methods: {
      async loadTreeData(prdId) {
        const parentId = 0;
        [this.treeData, this.allShelfHeight, this.allMountHeight, this.allShelfConstraint, this.allInstallation] =
          await Promise.all([getMenuTree(prdId, parentId), getAllHeight(prdId),
            getAllMountHeight(), getShelfConstraint(prdId), getAllInstallation(prdId)
          ])
      },
      deleteChoice() {
        console.log('delete!!')
      },
      async handleNodeClick(data) {
        //console.log(data)
        if (this.selectedList.length === 0) {
          this.optionalList = await getOptionalListByCateId(data.categoryId)
        }
      },
      showDetailDialog(detail){
        this.currentComponentDetail = detail
        this.centerDialogVisible = true
      }
    },
    watch: {}
  }
</script>

<style>
  .custom-tree-node {
    padding: 5px 8px;
    font-size: 15px;
  }

  .mixin-components-container {
    background-color: #f0f2f5;
    padding: 0px;
    min-height: calc(100vh - 84px);
  }

  .component-item {
    min-height: 100px;
  }

  #selectedList .custom-card .el-card__header {
    padding: 5px;
  }

  .custom-card .el-card__body {
    padding: 8px;
  }

  #selectedList .el-card__header {
    padding: 10px 20px;
  }

  #toSelect .el-card__header {
    padding: 10px 20px;
  }

  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
