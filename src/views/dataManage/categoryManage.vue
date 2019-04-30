<template>
  <el-row>
    <el-col :span="24">
      <el-col :span="4">
        <el-select v-model="currentProduct" value-key="productId" placeholder="请选择产品类型"
                   style="padding: 50px 0 20px 50px;">
          <el-option
            v-for="product in productList"
            :key="product.productId"
            :label="product.productName"
            :value="product">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-top: 65px;padding-left: -20px">
          <el-breadcrumb-item v-show="currentProduct"><a @click="grade = 1; selectNextList({categoryId:0})">顶级分类列表</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-show="categoryEntity_1"><a @click="grade = 2; selectNextList(categoryEntity_1)">{{categoryEntity_1
            ? categoryEntity_1.categoryName : ''}}</a></el-breadcrumb-item>
          <el-breadcrumb-item v-show="categoryEntity_2"><a @click="grade = 3; selectNextList(categoryEntity_2)">{{categoryEntity_2
            ? categoryEntity_2.categoryName : ''}}</a></el-breadcrumb-item>
          <el-breadcrumb-item v-show="categoryEntity_3"><a @click="grade = 4; selectNextList(categoryEntity_3)">{{categoryEntity_3
            ? categoryEntity_3.categoryName : ''}}</a></el-breadcrumb-item>
          <el-button class="filter-item" type="primary" size="small" icon="el-icon-plus" style="margin-top: -10px"
                     @click="newCate()">新增分类
          </el-button>
        </el-breadcrumb>
      </el-col>
    </el-col>
    <el-table
      :data="currentCategoryList"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="类别名称" prop="id" align="center" width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="450px" class-name="small-padding fixed-width"
                       style="padding-left: 0;padding-right: 0">
        <template slot-scope="scope" style="margin-left: 0;margin-right: 0">
          <el-button v-show="!scope.row.isLeaf && grade < 4" type="info" size="mini"
                     @click="grade++; selectNextList(scope.row)"
                     style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px">查看下级
          </el-button>
          <el-button size="mini" type="warning"
                     style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px"
                     @click="dialogRenameCategory = true; currentToChangeCateId = scope.row.categoryId">修改
          </el-button>
          <el-button size="mini" type="danger"
                     style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px"
                     @click="removeCate(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增分类" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="categoryAddRequest">
        <el-form-item label="上级分类" :label-width="formLabelWidth">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-top: 13px;">
            <el-breadcrumb-item v-show="!categoryEntity_1"><a href="javascript: void(0);">正在添加顶级分类！</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-show="categoryEntity_1"><a href="javascript: void(0);">{{categoryEntity_1 ?
              categoryEntity_1.categoryName : ''}}</a></el-breadcrumb-item>
            <el-breadcrumb-item v-show="categoryEntity_2"><a href="javascript: void(0);">{{categoryEntity_2 ?
              categoryEntity_2.categoryName : ''}}</a></el-breadcrumb-item>
            <el-breadcrumb-item v-show="categoryEntity_3"><a href="javascript: void(0);">{{categoryEntity_3 ?
              categoryEntity_3.categoryName : ''}}</a></el-breadcrumb-item>
          </el-breadcrumb>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="categoryAddRequest.newCategoryName" auto-complete="off" placeholder="分类名称"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" :label-width="formLabelWidth">
          <el-select v-model="categoryAddRequest.isShow" placeholder="是否显示">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="grade === 1" label="是否为主部件类别" :label-width="formLabelWidth">
          <el-select v-model="categoryAddRequest.isMainCate" placeholder="是否为主部件类别">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="grade === 1" label="是否为安装方式类别" :label-width="formLabelWidth">
          <el-select v-model="categoryAddRequest.isInstallation" placeholder="是否为安装方式类别">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="grade === 1" label="是否为架子组件类别" :label-width="formLabelWidth">
          <el-select v-model="categoryAddRequest.isShelf" placeholder="是否为架子组件类别">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="grade === 1" label="是否为电压类别" :label-width="formLabelWidth">
          <el-select v-model="categoryAddRequest.isVoltage" placeholder="是否为电压类别">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="grade === 1" label="排序号" :label-width="formLabelWidth">
          <el-input type="number" v-model="categoryAddRequest.categoryOrder" auto-complete="off"
                    placeholder="排序号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重命名分类" :visible.sync="dialogRenameCategory" width="30%">
      <el-form :model="renameForm">
        <el-form-item label="新的分类名称" :label-width="formLabelWidth">
          <el-input v-model="renameForm.newName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRenameCategory = false">取 消</el-button>
        <el-button type="primary" @click="renameCategory()">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import { getOneLevelCategory, addCategory, delCategory, rename } from '@/api/category'
  import { fetchList } from '@/api/product'

  export default {
    name: 'categoryManage',
    data() {
      return {
        dialogFormVisible: false,
        formLabelWidth: '150px',
        productList: [],
        currentProduct: undefined,
        currentCategoryList: [],
        productId: 0,
        categoryAddRequest: {
          isShow: true,
          isMainCate: false,
          isInstallation: false,
          isShelf: false,
          isVoltage: false,
          categoryOrder: null,
          preCategories: []
        },
        //层级号
        grade: 1,
        categoryEntity_1: undefined,
        categoryEntity_2: undefined,
        categoryEntity_3: undefined,
        currentToChangeCateId: 0,
        dialogRenameCategory: false,
        renameForm: {
          newName: ''
        }
      }
    },
    mounted() {
      this.loadPageData()
    },
    methods: {
      async loadPageData() {
        this.productList = await fetchList()
      },
      async addCate() {
        this.inputcategoryAddRequest()
        await addCategory(this.categoryAddRequest)
        this.$message('添加成功')
        this.reloadCategoryList()
        this.dialogFormVisible = false
      },
      async removeCate(category) {
        if (category.componentsId && JSON.parse(category.componentsId).length > 0) {
          this.$message('该分类还有具体部件，无法删除')
          return
        }
        this.inputcategoryAddRequest()
        const query = {
          productId: this.categoryAddRequest.product.productId,
          parentId: category.categoryId
        }
        const sonCate = await getOneLevelCategory(query)
        if (sonCate.length > 0) {
          this.$message('该分类还有子分类，无法删除')
        } else {
          await delCategory(category)
          this.$message('删除成功')
          this.reloadCategoryList()
        }
      },
      async selectNextList(category) {
        if (this.grade === 1) {//如果为1级
          this.categoryEntity_1 = null
          this.categoryEntity_2 = null
          this.categoryEntity_3 = null
        } else if (this.grade === 2) {//如果为2级
          this.categoryEntity_1 = category
          this.categoryEntity_2 = null
          this.categoryEntity_3 = null
        } else if (this.grade === 3) {//如果为3级
          this.categoryEntity_2 = category
          this.categoryEntity_3 = null
        } else if (this.grade === 4) {//如果为4级
          this.categoryEntity_3 = category
        }
        const query = {
          productId: this.currentProduct.productId,
          parentId: category.categoryId
        }
        this.currentCategoryList = await getOneLevelCategory(query)
      },
      async newCate() {
        if (this.currentProduct) {
          this.dialogFormVisible = true
        }
      },
      inputcategoryAddRequest() {
        this.categoryAddRequest.product = this.currentProduct
        this.categoryAddRequest.preCategories = []
        if (this.categoryEntity_1) {
          this.categoryAddRequest.preCategories.push(this.categoryEntity_1)
        }
        if (this.categoryEntity_2) {
          this.categoryAddRequest.preCategories.push(this.categoryEntity_2)
        }
        if (this.categoryEntity_3) {
          this.categoryAddRequest.preCategories.push(this.categoryEntity_3)
        }
      },
      async renameCategory() {
        await rename({ categoryName: this.renameForm.newName, categoryId: this.currentToChangeCateId })
        this.$message('修改成功')
        this.dialogRenameCategory = false
        this.inputcategoryAddRequest()
        this.reloadCategoryList()
        this.renameForm.newName = ''
      },
      async reloadCategoryList() {
        let query = {
          productId: this.currentProduct.productId,
          parentId: this.categoryAddRequest.preCategories.length === 0 ? 0 : this.categoryAddRequest.preCategories[this.categoryAddRequest.preCategories.length - 1].categoryId
        }
        this.currentCategoryList = await getOneLevelCategory(query)
        this.categoryAddRequest = {
          isShow: true,
          isMainCate: false,
          isInstallation: false,
          isShelf: false,
          isVoltage: false,
          categoryOrder: null,
          preCategories: []
        }
      }
    },
    watch: {
      'currentProduct.productId': async function(newVal) {
        if (newVal !== 0) {
          const query = {
            productId: newVal,
            parentId: 0
          }
          this.currentCategoryList = await getOneLevelCategory(query)
        }
      },
      'categoryAddRequest.isMainCate': function(newVal) {
        if (newVal) {
          this.categoryAddRequest.isInstallation = false
          this.categoryAddRequest.isShelf = false
          this.categoryAddRequest.isVoltage = false
        }
      },
      'categoryAddRequest.isInstallation': function(newVal) {
        if (newVal) {
          this.categoryAddRequest.isMainCate = false
          this.categoryAddRequest.isShelf = false
          this.categoryAddRequest.isVoltage = false
        }
      },
      'categoryAddRequest.isShelf': function(newVal) {
        if (newVal) {
          this.categoryAddRequest.isMainCate = false
          this.categoryAddRequest.isInstallation = false
          this.categoryAddRequest.isVoltage = false
        }
      },
      'categoryAddRequest.isVoltage': function(newVal) {
        if (newVal) {
          this.categoryAddRequest.isMainCate = false
          this.categoryAddRequest.isInstallation = false
          this.categoryAddRequest.isShelf = false
        }
      }
    }
  }
</script>
