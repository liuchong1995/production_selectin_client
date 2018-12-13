<template>
  <el-form ref="form" :model="form" label-width="120px" style="padding: 50px">
    <el-form-item label="所属产品类型">
      <el-select v-model="form.region" placeholder="请选择产品类型">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属分类">
      <el-select v-model="form.region" placeholder="请选择一级分类">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
      <el-select v-model="form.region" placeholder="请选择二级分类">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
      <el-select v-model="form.region" placeholder="请选择三级分类">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
      <el-select v-model="form.region" placeholder="请选择四级分类">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="产品名称">
      <el-input v-model="form.name" placeholder="产品名称" style="width: 300px"></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="6">
        <el-form-item label="产品型号">
          <el-input v-model="form.name" placeholder="产品型号" style="width: 300px"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="产品短码">
          <el-input v-model="form.name" placeholder="产品短码" style="width: 150px"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="型号生成码">
          <el-input v-model="form.name" placeholder="型号生成码" style="width: 300px"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item label="产品类型">
            <el-radio-group v-model="form.resource" size="small">
              <el-radio-button label="部件"></el-radio-button>
              <el-radio-button label="规格"></el-radio-button>
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
          <el-input :rows="3" v-model="form.name" type="textarea" placeholder="产品描述" style="width: 400px"></el-input>
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
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import E from 'wangeditor'
  import {uploadUrl, compImgUploadUrl} from '@/api/component'
  export default {
    name: 'ComponentDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        imageUrl:'',
        editor: null,
        compImgUploadUrl
      }
    },
    mounted(){
      this.setEditor()
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = `/PS/${res.url}`;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isJPG && isLt2M;
      },
      setEditor () {
        this.editor = new E(this.$refs.toolbar, this.$refs.editor)
        this.editor.customConfig.uploadImgServer = uploadUrl
        this.editor.customConfig.uploadFileName = 'photoList'
        this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024
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
        this.editor.create()
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
    width: 80%;
    margin: 0;
  }
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    border: 1px solid #ccc;
    height: 200px;
  }
</style>
