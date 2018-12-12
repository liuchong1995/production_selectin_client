<template>
  <el-row>
    <el-col :span="24">
      <el-select v-model="currentProductId" placeholder="请选择产品类型" style="padding: 50px">
        <el-option
          v-for="product in productList"
          :key="product.productId"
          :label="product.productName"
          :value="product.productId">
        </el-option>
      </el-select>
    </el-col>
    <el-col class="custom-tree-container" :span="6" style="padding-left: 50px">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :highlight-current="false"
        node-key="categoryId"
        :default-expanded-keys="defaultExpandedKeys"
        accordion
        :expand-on-click-node="false"
        >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span style="margin-left: 40px;font-size: 16px">
          <el-button
            type="text"
            size="mini"
            @click="addCate(node)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="removeCate(node)">
            删除
          </el-button>
        </span>
      </span>
      </el-tree>
    </el-col>
  </el-row>
</template>

<script>
  import { getAllMenuTree } from '@/api/category'
  import { fetchList } from '@/api/product'

  export default {
    name: 'categoryManage',
    data() {
      return {
        productList: [],
        currentProductId: undefined,
        defaultExpandedKeys: [],
        productId: 0,
        treeData: [],
        defaultProps: {
          label: 'categoryName',
          isLeaf: 'isLeaf',
          children: 'children'
        },
        categoryAddRequest:{
          isShow: true
        }
      }
    },
    mounted() {
      this.loadPageData()
    },
    methods: {
      async loadTreeData(prdId) {
        const parentId = 0
        this.treeData = await getAllMenuTree(prdId, parentId)
      },
      async loadPageData() {
        this.productList = await fetchList()
      },
      async addCate(node){

      },
      async removeCate(node){

      }
    },
    watch: {
      currentProductId: async function(newVal) {
        if (newVal !== 0) {
          await this.loadTreeData(newVal)
        }
      }
    }
  }
</script>
