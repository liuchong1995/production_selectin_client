<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb/>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <svg-icon v-if="roles.find(ele => ele === 'admin')" icon-class="admin" style="font-size: 25px"></svg-icon>
        <svg-icon v-else-if="roles.find(ele => ele === 'manager')" icon-class="manager"
                  style="font-size: 25px"></svg-icon>
        <svg-icon v-else="roles.find(ele => ele === 'user')" icon-class="user" style="font-size: 25px"></svg-icon>
        <i class="el-icon-caret-bottom"/>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="modifyPasswordFormVisible = true; modifyStep = 0">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">注销</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="modifyPasswordFormVisible" width="30%">
      <el-form :model="modifyPasswordForm">
        <el-form-item v-show="modifyStep === 0" label="请输入旧密码" :label-width="formLabelWidth">
          <el-input v-model="modifyPasswordForm.oldPassword" auto-complete="off" :type="passwordType"></el-input>
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
        <el-form-item v-show="modifyStep === 1" label="请输入新密码" :label-width="formLabelWidth">
          <el-input v-model="modifyPasswordForm.newPassword" auto-complete="off" :type="passwordType"></el-input>
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
        <el-form-item v-show="modifyStep === 1" label="再次输入" :label-width="formLabelWidth">
          <el-input v-model="modifyPasswordForm.newRepeatPassword" auto-complete="off" :type="passwordType"></el-input>
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyPasswordFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyStep === 0 ? checkPassword() : modifyPassword()">{{modifyStep === 0 ? '下一步'
          : '确定'}}
        </el-button>
      </div>
    </el-dialog>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { checkOldPassword, modifyPassword } from '@/api/user'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'

  export default {
    data() {
      return {
        modifyStep: 0, // 0 输入旧密码阶段，1 输入新密码阶段
        modifyPasswordForm: {
          oldPassword: '',
          newPassword: '',
          newRepeatPassword: ''
        },
        passwordType: 'password',
        modifyPasswordFormVisible: false,
        formLabelWidth: '120px'
      }
    },
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'roles'
      ]),
      currentUserName() {
        return this.$store.getters.name
      }
    },
    methods: {
      async checkPassword() {
        if (this.modifyStep === 0) {
          if (this.modifyPasswordForm.oldPassword === '') {
            this.$message.error('请输入旧密码！')
            return
          }
          let sameWithOld = await checkOldPassword({
            'username': this.currentUserName,
            'password': this.modifyPasswordForm.oldPassword
          })
          if (sameWithOld !== 200) {
            this.$message.error('旧密码错误！')
          } else {
            this.modifyStep = 1
            this.modifyPasswordForm.oldPassword = ''
          }
        }
      },
      async modifyPassword() {
        if (this.modifyPasswordForm.newPassword === '') {
          this.$message.error('请输入新密码！')
          return
        }
        if (this.modifyPasswordForm.newPassword !== this.modifyPasswordForm.newRepeatPassword) {
          this.$message.error('两次密码输入不一致！')
          return
        }
        await modifyPassword({ username: this.currentUserName, password: this.modifyPasswordForm.newRepeatPassword })
        this.$message.success('修改成功！')
        this.logout()
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: black;
    cursor: pointer;
    user-select: none;
  }

  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }

    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        line-height: initial;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>

