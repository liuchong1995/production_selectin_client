<template>
  <el-row style="padding: 30px">
    <el-col :span="24">
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-plus" style="margin: 10px"
                 @click="newProduct">新增产品
      </el-button>
    </el-col>
    <el-table
      :data="productList"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="产品名称" prop="id" align="center" width="350px">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分段区间" prop="id" align="center" width="250px">
        <template slot-scope="scope">
          <span>{{ handleSegmentation(scope.row.segmentation) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width"
                       style="padding-left: 0;padding-right: 0">
        <template slot-scope="scope" style="margin-left: 0;margin-right: 0">
          <el-button size="mini" type="danger"
                     style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px"
                     @click="removeProd(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增产品" :visible.sync="dialogFormVisible" width="1000px">
      <el-form :model="productAddRequest">
        <el-form-item label="产品名称" :label-width="formLabelWidth">
          <el-input v-model="productAddRequest.productName" auto-complete="off" placeholder="分类名称" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="选型项数" :label-width="formLabelWidth">
          <el-input-number v-model="choiceItems" :min="1" :max="100" label="选型项数"></el-input-number>
        </el-form-item>
        <el-form-item label="产品型号分段数" :label-width="formLabelWidth">
          <el-input-number v-model="subSectionCount" :min="1" :max="10" label="产品型号分段数"></el-input-number>
        </el-form-item>
        <el-form-item :label="`分段区间 ${index + 1}`" :label-width="formLabelWidth"
                      v-for="(item, index) in subSectionRanges" :key="index">
          <el-slider
            v-model="item.range"
            range
            show-stops
            :min="1"
            :max="choiceItems">
          </el-slider>
        </el-form-item>
        <el-form-item label="产品图片" :label-width="formLabelWidth">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProd()">保 存</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import { compImgUploadUrl } from '@/api/component'
  import { fetchList, canBeDelete, deleteOne, addProduct } from '@/api/product'

  export default {
    name: 'productManage',
    data() {
      return {
        value9: [4, 8],
        productList: [],
        choiceItems: 1,
        subSectionCount: 1,
        imageUrl: '',
        compImgUploadUrl,
        productAddRequest: {},
        subSectionRanges: [{ range: [1, 1] }],
        dialogFormVisible: false,
        formLabelWidth: '120px'
      }
    },
    mounted() {
      this.initPage()
    },
    computed: {
      subSectionCountToShow() {
        let res = []
        for (let i = 0; i < this.subSectionCount; i++) {
          res.push({})
        }
        return res
      }

    },
    watch: {
      subSectionCount: function(newVal) {
        this.subSectionRanges = []
        for (let i = 0; i < newVal; i++) {
          this.subSectionRanges.push({ range: [1, 1] })
        }
      }
    },

    methods: {
      async initPage() {
        this.productList = await fetchList()
      },
      handleSegmentation(segmentation) {
        const segmentationList = JSON.parse(segmentation)
        if (!segmentationList) {
          return ''
        }
        const subSections = segmentationList.length
        let keyNums = []
        if (segmentationList[0] === 1) {
          for (const num of segmentationList) {
            keyNums.push(num)
            keyNums.push(num + 1)
          }
        } else {
          keyNums.push(1)
          for (const num of segmentationList) {
            keyNums.push(num)
            keyNums.push(num + 1)
          }
        }
        keyNums.splice(keyNums.length - 1, 1)
        //生成分段串
        let subSectionsStr = ''
        if (keyNums.length % 2 !== 0) {
          subSectionsStr = subSectionsStr + keyNums[0] + ','
          for (let i = 1; i < keyNums.length; i += 2) {
            subSectionsStr = subSectionsStr + keyNums[i] + '-' + keyNums[i + 1] + ','
          }
        } else {
          for (let i = 0; i < keyNums.length; i += 2) {
            subSectionsStr = subSectionsStr + keyNums[i] + '-' + keyNums[i + 1] + ','
          }
        }
        return subSectionsStr.slice(0, subSectionsStr.length - 1)
      },
      newProduct() {
        this.dialogFormVisible = true
      },
      addProd() {
        const checkRes = this.checkSubSection()
        if (!checkRes){
          this.$message({
            type: 'error',
            message: '产品信息输入错误或分段不符合规则!'
          })
          return
        }
        let tempSegmentation = []
        for (const subSection of this.subSectionRanges) {
          tempSegmentation.push(subSection.range[1])
        }
        this.productAddRequest.segmentation = JSON.stringify(tempSegmentation)
        this.$confirm('您确定增加这个产品么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await addProduct(this.productAddRequest)
          this.dialogFormVisible = false
          this.initPage()
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
        })
      },
      checkSubSection() {
        if (this.subSectionRanges[0].range[0] !== 1
          || this.subSectionRanges[this.subSectionCount - 1].range[1] !== this.choiceItems) {
          return false
        }
        for (let i = 0; i < this.subSectionCount - 1; i++) {
          if (this.subSectionRanges[i].range[1] !== this.subSectionRanges[i + 1].range[0] - 1) {
            return false
          }
        }
        return !(!this.imageUrl || !this.productAddRequest.productName || !this.productAddRequest.productName.trim());

      },
      async removeProd(prod) {
        const res = await canBeDelete(prod.productId)
        if (res.length > 0) {
          this.$message('该产品下还有分类，无法删除！')
        } else {
          this.$confirm('您确定删除这个产品么, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            await deleteOne(prod.productId)
            this.initPage()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = `/PS/${res.url}`
        this.productAddRequest.productImg = res.url
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!')
        }
        return isJPG && isLt2M
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
    width: 220px;
    height: 235px;
    line-height: 235px;
    text-align: center;
  }

  .avatar {
    width: 220px;
    height: 235px;
    display: block;
  }
</style>
