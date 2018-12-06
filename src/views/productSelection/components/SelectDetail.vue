<template>
  <el-row>
    <el-dialog
      title="部件详情"
      :visible.sync="centerDialogVisible"
      width="80%"
      center>
      <span v-html="currentComponentDetail"></span>
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
                <el-input v-model="orderEntity.productModel" style="width: 300px" size="small" readonly
                          placeholder="产品型号"></el-input>
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
                <el-button type="success" size="small" @click="saveOrder">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="custom-card" style="margin:0;">
            <el-col :span="3" class="text-center" v-for="comp in selectedList" :key="comp.componentId">
              <el-card class="box-card">
                <div slot="header" class="clearfix" style="text-align: center;font-size: 14px;padding:2px">
                  <el-tooltip class="item" effect="light" :content="comp.componentName" placement="top-start"
                              :open-delay="300">
                    <el-col :span="21" class="ellipsis">{{comp.componentName}}</el-col>
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" :content="comp.componentModelNumber" placement="bottom-end"
                              :open-delay="300">
                    <el-col :span="21" class="ellipsis">{{comp.componentModelNumber}}</el-col>
                  </el-tooltip>
                  <svg-icon style="font-size: 18px;cursor: pointer;" icon-class="delete" v-if="comp.componentType !== 2"
                            @click.native="deleteChoice(comp)"/>
                </div>
                <div class="component-item">
                  <el-tooltip class="item" effect="light" :content="comp.componentReamrk" placement="top-start"
                              :open-delay="300">
                    <pan-thumb width="170px" height="180px"
                               :image="comp.componentImage">
                    </pan-thumb>
                  </el-tooltip>
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
                  <el-tooltip class="item" effect="light" :content="comp.componentReamrk" placement="top-start"
                              :open-delay="300">
                    <pan-thumb width="170px" height="180px"
                               :image="comp.componentImage" @click.native="showDetailDialog(comp.componentDetail)">
                    </pan-thumb>
                  </el-tooltip>
                </div>
                <el-tooltip class="item" effect="light" :content="comp.componentModelNumber" placement="bottom-end"
                            :open-delay="300">
                  <el-button type="primary" class="ellipsis" size="small" style="width: 100%;padding: 9px 5px"
                             @click="choiceComponent(comp)">
                    {{comp.componentModelNumber}}
                  </el-button>
                </el-tooltip>
              </el-card>
            </el-col>
          </div>
        </el-card>
      </el-row>
    </el-col>
    <el-dialog title="架子属性录入" :visible.sync="dialogFormVisible" width="30%">
      <el-form>
        <el-form-item label="架子组件高度(单位:mm)" :label-width="formLabelWidth">
          <el-select v-model="orderEntity.shelfHeight" placeholder="请选择架子组件高度">
            <el-option :value="shelfHeight.height" :label="shelfHeight.height"
                       v-for="(shelfHeight,index) in currentAllShelfHeight" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装高度(单位:mm)" :label-width="formLabelWidth">
          <el-select v-model="orderEntity.mountHeight" placeholder="请选择安装高度">
            <el-option :value="mountHeight.mountingHeightId" :label="mountHeight.height"
                       v-for="mountHeight in currentAllMountHeight" :key="mountHeight.mountingHeightId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectShelf(currentShelfSelectingId)">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import { getCategory, getMenuTree, refactorCategoryMenu } from '@/api/category'
  import { getAllHeight, getAllInstallation, getAllMountHeight, getShelfConstraint } from '@/api/shelf'
  import { getOptionalListByCateId, getOptionalListBySelected, getComponent, hasAttachment } from '@/api/component'
  import { generateModelNumber,getMandatoryResult,saveOrder } from '@/api/order'
  import PanThumb from '@/components/PanThumb/index'

  export default {
    name: 'SelectDetail',
    components: { PanThumb },
    data() {
      return {
        centerDialogVisible: false,
        dialogFormVisible: false,
        productId: 0,
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
        //第一次进入页面
        isFirstUse: true,
        //已选组件列表
        selectedList: [],
        //已选类型列表
        selectedTypeList: [],
        //订单实体，用于提交保存
        orderEntity: {
          productModel: '',
          shelfHeight: null,
          mountHeight: null
        },
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
        currentComponentDetail: '',
        currentShelfSelectingId: 0,
        currentAllShelfHeight: [],
        currentAllMountHeight: [],

        formLabelWidth: '200px'
      }
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.productId = this.$route.params && this.$route.params.productId
      this.refactorTreeRequest.productId = this.productId
      this.loadTreeData(this.productId)
    },
    methods: {
      async loadTreeData(prdId) {
        const parentId = 0;
        [this.treeData, this.allShelfHeight, this.allMountHeight, this.allShelfConstraint, this.allInstallation] =
          await Promise.all([getMenuTree(prdId, parentId), getAllHeight(prdId),
            getAllMountHeight(), getShelfConstraint(prdId), getAllInstallation(prdId)
          ])
      },
      deleteChoice(component) {
        let tempSelectedList = [...this.selectedList]
        let tempSelectedTypeList = [...this.selectedTypeList]
        tempSelectedList.splice(tempSelectedList.indexOf(component), 1)//删除
        tempSelectedTypeList.splice(tempSelectedTypeList.indexOf(component.firstCategoryId), 1)//删除
        this.handleAttachmentRemove(tempSelectedList, tempSelectedTypeList, component)
      },
      async handleAttachmentRemove(tempSelectedList, tempSelectedTypeList, component) {
        //如果有附件
        let getAttachmentRequest = {}
        getAttachmentRequest.componentId = component.componentId
        getAttachmentRequest.selectedList = tempSelectedList
        const attachment = await hasAttachment(getAttachmentRequest)
        if (attachment.length > 0) {
          for (let attach of attachment) {
            this.currantAttachment.push(attach)
          }
        }
        if (this.currantAttachment.length > 0) {
          for (let attach of this.currantAttachment) {
            tempSelectedList.splice(tempSelectedList.findIndex(ele => ele.componentId === attach.componentId), 1)//删除
            tempSelectedTypeList.splice(tempSelectedTypeList.indexOf(attach.firstCategoryId), 1)//删除
          }
          this.currantAttachment.length = 0
        }
        this.selectedList = [...tempSelectedList]
        this.selectedTypeList = [...tempSelectedTypeList]
        this.refactorTreeRequest.selectedList = [...this.selectedList]
      },
      async handleNodeClick(data) {
        const cateId = data.categoryId
        if (this.selectedList.length === 0) {
          this.optionalList = await getOptionalListByCateId(cateId)
        } else {
          this.optionalListBySelectedRequest.categoryId = cateId
          this.optionalListBySelectedRequest.selectedList = this.selectedList
          this.optionalList = await getOptionalListBySelected(this.optionalListBySelectedRequest)
        }
      },
      showDetailDialog(detail) {
        this.currentComponentDetail = detail
        this.centerDialogVisible = true
      },
      async choiceComponent(comp) {
        if (this.selectedTypeList.find(ele => ele === comp.firstCategoryId)) {
          this.$message('同一种类型组件只能选一种，请删除相应组件后再选择')
          return
        }
        const selectCategory = await getCategory(comp.firstCategoryId)
        if (selectCategory.categoryProperties) {
          if (this.hasInstallation().size === 0) {
            this.$message('选择架子组件前请先选择安装方式！')
            return
          }
          this.currentShelfSelectingId = comp.componentId
          this.currentAllShelfHeight = this.allShelfHeight[this.currentShelfSelectingId]
          this.currentAllMountHeight = this.allMountHeight
          this.orderEntity.shelfHeight = null
          this.orderEntity.mountHeight = null
          this.dialogFormVisible = true
        } else {
          let tempSelectedList = [...this.selectedList]
          let tempSelectedTypeList = [...this.selectedTypeList]
          const currentSelectComp = await getComponent(comp.componentId)
          tempSelectedList.push(currentSelectComp)
          tempSelectedTypeList.push(currentSelectComp.firstCategoryId)
          this.handleAttachment(tempSelectedList, tempSelectedTypeList, currentSelectComp.componentId)
        }
      },
      hasInstallation() {
        let allSelectedId = new Set(this.selectedList.map(ele => ele.componentId))
        let allInstallationId = new Set(this.allInstallation.map(ele => ele.componentId))
        return new Set([...allSelectedId].filter(x => allInstallationId.has(x)))
      },
      async selectShelf(shelfId) {
        if (!this.orderEntity.shelfHeight || !this.orderEntity.mountHeight) {
          this.$message('请输入架子高度和安装高度！')
          return
        }
        const currentShelf = await getComponent(shelfId)
        let tempSelectedList = [...this.selectedList]
        let tempSelectedTypeList = [...this.selectedTypeList]
        tempSelectedList.push(currentShelf)
        tempSelectedTypeList.push(currentShelf.firstCategoryId)
        this.handleAttachment(tempSelectedList, tempSelectedTypeList, shelfId)
        this.dialogFormVisible = false
      },
      async handleAttachment(tempSelectedList, tempSelectedTypeList, componentId) {
        //如果有附件
        let getAttachmentRequest = {}
        getAttachmentRequest.componentId = componentId
        getAttachmentRequest.selectedList = tempSelectedList
        const attachment = await hasAttachment(getAttachmentRequest)
        if (attachment.length > 0) {
          if (this.selectedTypeList.filter(typeId => attachment.map(attach => attach.firstCategoryId).indexOf(typeId) > -1).length > 0) {
            this.$message('该组件存在附件并且附件类型已选择，请删除相应组件后再选择！')
            return
          }
          for (let attach of attachment) {
            this.currantAttachment.push(attach)
          }
        }
        if (this.currantAttachment.length > 0) {
          for (let attach of this.currantAttachment) {
            tempSelectedList.push(attach)
            tempSelectedTypeList.push(attach.firstCategoryId)
          }
          this.currantAttachment.length = 0
        }
        this.selectedList = [...tempSelectedList]
        this.selectedTypeList = [...tempSelectedTypeList]
        this.refactorTreeRequest.selectedList = [...this.selectedList]
      },
      async generateModelNumber() {
        let generateOrderModelNumberRequest = this.refactorTreeRequest
        generateOrderModelNumberRequest.shelfHeight = this.orderEntity.shelfHeight
        generateOrderModelNumberRequest.mountHeight = this.allMountHeight.find(ele => ele.mountingHeightId === this.orderEntity.mountHeight)
        this.orderEntity.productModel = await generateModelNumber(generateOrderModelNumberRequest)
      },
      async saveOrder() {
        this.orderEntity.productId = this.productId;
        if (this.selectedList.length === 0) {
          this.$message('请至少选择一个部件!');
          return;
        }
        this.orderEntity.componentIds = JSON.stringify(this.selectedList)
        const mandatoryResult = await getMandatoryResult(this.orderEntity)
        if (mandatoryResult.categories.length > 0 || mandatoryResult.components.length > 0) {
          let mandatoryMessage = '';
          if (mandatoryResult.categories.length > 0) {
            mandatoryMessage = mandatoryMessage.concat('必选类型:');
            mandatoryResult.categories.forEach(ele => mandatoryMessage = mandatoryMessage.concat(ele.categoryName.concat(' ')));
          }
          if (mandatoryResult.components.length > 0) {
            mandatoryMessage = mandatoryMessage.concat('必选部件:');
            mandatoryResult.components.forEach(ele => mandatoryMessage = mandatoryMessage.concat(ele.componentName.concat(' ')).concat(ele.componentModelNumber.concat(' ')));
          }
          this.$message('当前选型下以下选项为必选项，' + mandatoryMessage);
        } else {
          await saveOrder(this.orderEntity)
          this.$message('保存成功!');
        }
      }
    },
    watch: {
      'selectedList.length': async function(newVal) {
        if (newVal !== 0) {
          this.treeData = await refactorCategoryMenu(this.refactorTreeRequest)
          this.generateModelNumber()
        } else {
          this.treeData = await getMenuTree(this.productId, 0)
          this.orderEntity.productModel = ''
        }
      }
    }
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
