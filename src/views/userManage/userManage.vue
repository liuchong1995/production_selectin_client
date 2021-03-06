<template>
  <div class="app-container">

    <div class="filter-container" style="padding-bottom: 10px">
      <el-button class="filter-item" type="primary" size="small" icon="el-icon-plus" @click=" dialogFormVisible = true">
        新增用户
      </el-button>
    </div>

    <el-table
      :data="allUser.list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="登录名" prop="id" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.chineseName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ parseRoles(scope.row.roles) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.enable ? '可用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width"
                       style="padding-left: 0;padding-right: 0">
        <template slot-scope="scope" style="margin-left: 0;margin-right: 0">
          <el-button type="info" size="mini" @click="handleBan(scope.row.userId)"
                     style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px">{{ scope.row.enable ?
            '禁用' : '启用' }}
          </el-button>
          <el-button size="mini" type="danger"
                     style="margin-left: 0;margin-right: 0;padding-left: 12px;padding-right: 12px"
                     @click="handleDelete(scope.row.userId)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="allUser.total>0" :total="allUser.total" :page.sync="listQuery.page"
                :limit.sync="listQuery.limit" @pagination="getList"/>

    <el-dialog title="新增用户" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="userEntity">
        <el-form-item label="登录名" :label-width="formLabelWidth">
          <el-input v-model="userEntity.username" auto-complete="off" placeholder="登录名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="userEntity.chineseName" auto-complete="off" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" v-model="userEntity.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="userEntity.roles" placeholder="请选择角色">
            <el-option :label="role.roleChineseName" :value="role.roleId" v-for="role in allRoles"
                       :key="role.roleId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { searchUsers, getAllRoles, banOrDebanUser, deleteUser, saveUser } from '@/api/user'

  export default {
    name: 'userManage',
    components: { Pagination },
    data() {
      return {
        allUser: {
          total: 1
        },
        allRoles: [],
        listQuery: {
          page: 1,
          limit: 10
        },
        dialogFormVisible: false,
        formLabelWidth: '100px',
        userEntity: {}
      }
    },
    mounted() {
      this.loadData()
    },
    methods: {
      async loadData() {
        this.allRoles = await getAllRoles()
        this.allUser = await searchUsers(this.listQuery)
      },
      async handleBan(userId) {
        await banOrDebanUser(userId)
        this.getList()
      },
      async handleDelete(userId) {
        this.$confirm('您确定删除这个用户么, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await deleteUser(userId)
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      },
      async getList() {
        this.allUser = await searchUsers(this.listQuery)
      },
      parseRoles(roles) {
        return this.allRoles.find(ele => ele.roleId === JSON.parse(roles)[0]).roleChineseName
      },
      async addUser() {
        let roles = []
        roles.push(this.userEntity.roles)
        this.userEntity.roles = JSON.stringify(roles)
        await saveUser(this.userEntity)
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.getList()
        this.userEntity = {}
        this.dialogFormVisible = false
      }
    }
  }
</script>
