<template>
  <el-form ref="compForm" :model="componentAddRequest" :rules="rules" label-width="120px" style="padding: 50px">
    <el-form-item label="所属产品类型">
      <el-select v-model="componentAddRequest.productId" placeholder="请选择产品类型">
        <el-option v-for="(product,index) in productList" :key="index" :value="product.productId"
                   :label="product.productName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属分类" v-show="componentAddRequest.productId">
      <el-select v-model="firstCategoryId" placeholder="请选择一级分类">
        <el-option :value="firstCategory.categoryId" v-for="(firstCategory,index) in firstCategoryList" :key="index"
                   :label="firstCategory.categoryName"></el-option>
      </el-select>
      <el-select v-model="secondCategoryId" v-show="firstCategoryId" placeholder="请选择二级分类">
        <el-option :value="secondCategory.categoryId" v-for="(secondCategory,index) in secondCategoryList" :key="index"
                   :label="secondCategory.categoryName"></el-option>
      </el-select>
      <el-select v-model="thirdCategoryId" v-show="secondCategoryId" placeholder="请选择三级分类">
        <el-option :value="thirdCategory.categoryId" v-for="(thirdCategory,index) in thirdCategoryList" :key="index"
                   :label="thirdCategory.categoryName"></el-option>
      </el-select>
      <el-select v-model="forthCategoryId" v-show="thirdCategoryId" placeholder="请选择四级分类">
        <el-option :value="forthCategory.categoryId" v-for="(forthCategory,index) in forthCategoryList" :key="index"
                   :label="forthCategory.categoryName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="产品名称" prop="componentName">
      <el-input v-model="componentAddRequest.componentName" placeholder="产品名称" style="width: 300px"></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="6">
        <el-form-item label="产品型号" prop="componentModelNumber">
          <el-input v-model="componentAddRequest.componentModelNumber" placeholder="产品型号"
                    style="width: 300px"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="产品短码" prop="componentShortNumber">
          <el-input v-model="componentAddRequest.componentShortNumber" placeholder="产品短码"
                    style="width: 150px"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="型号生成码">
          <el-input v-model="componentAddRequest.componentKey" placeholder="型号生成码" style="width: 300px"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="产品类型">
          <el-radio-group v-model="componentAddRequest.componentType" size="small">
            <el-radio-button :label="1">部件</el-radio-button>
            <el-radio-button :label="0">规格</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="缩略图">
          <el-upload
            class="avatar-uploader"
            :action="compImgUploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            name="singleImage">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="产品描述">
          <el-input :rows="3" v-model="componentAddRequest.componentReamrk" type="textarea" placeholder="产品描述"
                    style="width: 400px"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="详细描述">
      <div class="editor">
        <div ref="toolbar" class="toolbar">
        </div>
        <div ref="editor" class="text">
        </div>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import E from 'wangeditor'
  import { uploadUrl, compImgUploadUrl, isExit, addComp, getComponentToShow, updateComponent } from '@/api/component'
  import { fetchList } from '@/api/product'
  import { getOneLevelCategory } from '@/api/category'

  export default {
    name: 'ComponentDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validateComponentName = async(rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入产品名称'))
        } else {
          callback()
        }
      }
      const validateComponentModelNumber = async(rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入产品型号'))
        } else {
          const res = await isExit(this.componentAddRequest)
          if (!this.isEdit && res.length > 0) {
            callback(new Error('已存在相同的产品型号'))
          } else if (this.isEdit && res.length > 1) {
            callback(new Error('已存在相同的产品型号'))
          } else {
            callback()
          }
        }
      }
      const validateComponentShortNumber = async(rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入产品短码'))
        } else {
          const res = await isExit(this.componentAddRequest)
          if (!this.isEdit && res.length > 0) {
            callback(new Error('已存在相同的产品短码'))
          } else if (this.isEdit && res.length > 1) {
            callback(new Error('已存在相同的产品短码'))
          } else {
            callback()
          }
        }
      }
      return {
        //修改时的部件Id
        componentId: undefined,

        productList: [],
        componentAddRequest: {
          productId: undefined,
          componentType: 1,
          componentImage: '',
          componentName: ''
        },
        firstCategoryList: [],
        secondCategoryList: [],
        thirdCategoryList: [],
        forthCategoryList: [],
        firstCategoryId: undefined,
        secondCategoryId: undefined,
        thirdCategoryId: undefined,
        forthCategoryId: undefined,
        imageUrl: '',
        editor: null,
        compImgUploadUrl,
        rules: {
          componentName: [{ validator: validateComponentName, trigger: 'blur' }],
          componentModelNumber: [{ validator: validateComponentModelNumber, trigger: 'blur' }],
          componentShortNumber: [{ validator: validateComponentShortNumber, trigger: 'blur' }]
        },
        firstComeThisPage: true
      }
    },
    mounted() {
      this.setEditor()
      if (!this.isEdit) {
        this.loadPageData()
      } else {
        this.initEditPage()
      }
    },
    computed: {
      currentUserName() {
        return this.$store.getters.name
      }
    },
    methods: {
      onSubmit() {
        this.$refs.compForm.validate(async valid => {
          if (valid) {
            this.componentAddRequest.categoryIds = []
            if (this.firstCategoryId) {
              this.componentAddRequest.categoryIds.push(this.firstCategoryId)
            }
            if (this.secondCategoryId) {
              this.componentAddRequest.categoryIds.push(this.secondCategoryId)
            }
            if (this.thirdCategoryId) {
              this.componentAddRequest.categoryIds.push(this.thirdCategoryId)
            }
            if (this.forthCategoryId) {
              this.componentAddRequest.categoryIds.push(this.forthCategoryId)
            }
            this.componentAddRequest.componentDetail = this.editor.txt.html()
            const replaceStr1 = /\bstyle="max-width:100%;"/g
            const replaceStr2 = /\bstyle="max-width: 100%;"/g
            const replacedStr = "width:100% height:100%"
            this.componentAddRequest.componentDetail = this.componentAddRequest.componentDetail.replace(replaceStr1,replacedStr)
            this.componentAddRequest.componentDetail = this.componentAddRequest.componentDetail.replace(replaceStr2,replacedStr)
            let result = await this.checkForm()
            if (result.code !== 200) {
              this.$message(result.msg)
              return false
            }
            const operation = !this.isEdit ? '新增' : '修改'
            this.componentAddRequest.creator = this.currentUserName
            this.$confirm(`您确定${operation}这个部件么, 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async() => {
              if (!this.isEdit) {
                await addComp(this.componentAddRequest)
              } else {
                let updateData = {};
                [updateData.compId, updateData.updateRequest] = [this.componentId, this.componentAddRequest]
                await updateComponent(updateData)
              }
              this.$message({
                type: 'success',
                message: `${operation}成功`
              })
            })
          } else {
            this.$message('表单中还存在错误的输入项')
            return false
          }
        })
      },
      async initEditPage() {
        this.componentId = this.$route.params && this.$route.params.compId;
        [this.componentAddRequest, this.productList] = await Promise.all([getComponentToShow(this.componentId), fetchList()])
        this.imageUrl = this.componentAddRequest.componentImage
        this.editor.txt.html(this.componentAddRequest.componentDetail);
        [this.firstCategoryId, this.secondCategoryId = undefined, this.thirdCategoryId = undefined, this.forthCategoryId = undefined]
          = this.componentAddRequest.categoryIds
        setTimeout(() => this.firstComeThisPage = false, 1000)
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = `/PS/${res.url}`
        this.componentAddRequest.componentImage = res.url
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!')
        }
        return isJPG && isLt2M
      },
      setEditor() {
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)
        this.editor.customConfig.uploadImgServer = uploadUrl
        this.editor.customConfig.uploadFileName = 'photoList'
        this.editor.customConfig.uploadImgMaxSize = 50 * 1024 * 1024
        this.editor.customConfig.uploadImgMaxLength = 5
        this.editor.customConfig.menus = [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'justify', // 对齐方式
          'image', // 插入图片
          'undo', // 撤销
          'redo' // 重复
        ]
        // 创建富文本编辑器
        this.editor.customConfig.zIndex = 1
        this.editor.create()
      },
      async loadPageData() {
        this.productList = await fetchList()
      },
      async checkForm() {
        let result = {}
        if (!this.editor.txt.text()) {
          if (this.editor.txt.html().indexOf('<img') < 0) {
            result.msg = '请输入部件详细描述'
            result.code = 500
            return result
          }
        }
        let allCategory = [...this.firstCategoryList, ...this.secondCategoryList, ...this.thirdCategoryList, ...this.forthCategoryList]
        let lastCate = allCategory.find(ele => ele.categoryId === this.componentAddRequest.categoryIds[this.componentAddRequest.categoryIds.length - 1])
        if (!lastCate.isLeaf) {
          const query = {
            productId: this.componentAddRequest.productId,
            parentId: lastCate.categoryId
          }
          const isRealLeaf = await getOneLevelCategory(query)
          if (isRealLeaf.length > 0) {
            result.msg = '只能在叶子分类添加部件'
            result.code = 500
            return result
          }
        }
        if (!this.componentAddRequest.componentImage) {
          result.msg = '请上传产品图片'
          result.code = 500
          return result
        }
        result.msg = 'ok'
        result.code = 200
        return result
      }
    },
    watch: {
      'componentAddRequest.productId': async function(newVal) {
        if (newVal) {
          const query = {
            productId: this.componentAddRequest.productId,
            parentId: 0
          }
          this.firstCategoryList = await getOneLevelCategory(query)
        }
        if (!this.isEdit || !this.firstComeThisPage) {
          this.firstCategoryId = undefined
          this.secondCategoryId = undefined
          this.thirdCategoryId = undefined
          this.forthCategoryId = undefined
        }
      },
      firstCategoryId: async function(newVal) {
        if (newVal) {
          const query = {
            productId: this.componentAddRequest.productId,
            parentId: newVal
          }
          this.secondCategoryList = await getOneLevelCategory(query)
        }
        if (!this.isEdit || !this.firstComeThisPage) {
          this.secondCategoryId = undefined
          this.thirdCategoryId = undefined
          this.forthCategoryId = undefined
        }
      },
      secondCategoryId: async function(newVal) {
        if (newVal) {
          const query = {
            productId: this.componentAddRequest.productId,
            parentId: newVal
          }
          this.thirdCategoryList = await getOneLevelCategory(query)
        }
        if (!this.isEdit || !this.firstComeThisPage) {
          this.thirdCategoryId = undefined
          this.forthCategoryId = undefined
        }
      },
      thirdCategoryId: async function(newVal) {
        if (newVal) {
          const query = {
            productId: this.componentAddRequest.productId,
            parentId: newVal
          }
          this.forthCategoryList = await getOneLevelCategory(query)
        }
        if (!this.isEdit || !this.firstComeThisPage) {
          this.forthCategoryId = undefined
        }
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .editor {
    width: 100%;
    margin: 0;
  }

  .toolbar {
    border: 1px solid #ccc;
  }

  .text {
    border: 1px solid #ccc;
    height: 600px;
  }
</style>
