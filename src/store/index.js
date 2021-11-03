import Vuex from 'vuex'
import Vue from 'vue'
import {getToken, setToken, removeToken} from '@/request/token'
import {login, getUserInfo, logout, register, changePassword, getVerifyNumber} from '@/api/login'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    id: '',
    account: '',
    name: '',
    avatar: '',
    token: getToken(),
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ID: (state, id) => {
      state.id = id
    }
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        login(user.account, user.password).then(data => {
          if(data.success){
            commit('SET_TOKEN', data.data)
            setToken(data.data)
            resolve()
          }else{
            reject(data.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    changePassword({commit}, user) {
      return new Promise((resolve, reject) => {
        changePassword(user.account, user.password,user.mobilePhoneNumber,user.verifyNumber).then(data => {
          if(data.success){
            commit('SET_TOKEN', data.data)
            setToken(data.data)
            resolve(data)
          }else{
            reject(data)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getVerifyNumber({commit}, mobilePhoneNumber) {
      return new Promise((resolve, reject) => {
        getVerifyNumber(mobilePhoneNumber).then(data => {
          if(data.success){
            resolve(data)
          }else{
            reject(data)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    getUserInfo({commit, state}) {

      let that = this
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(data => {
          if (data.success) {
            commit('SET_ACCOUNT', data.data.account)
            commit('SET_NAME', data.data.nickname)
            commit('SET_AVATAR', data.data.avatar)
            commit('SET_ID', data.data.id)
            resolve(data)
          } else {
            commit('SET_ACCOUNT', '')
            commit('SET_NAME', '')
            commit('SET_AVATAR', '')
            commit('SET_ID', '')
            removeToken()
            resolve(data)
          }
          return false
        }).catch(error => {
          commit('SET_ACCOUNT', '')
          commit('SET_NAME', '')
          commit('SET_AVATAR', '')
          commit('SET_ID', '')
          removeToken()
          reject(error)
          return false
        })
      })
    },
    // 退出
    logout({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(data => {
          if(data.success){

            commit('SET_TOKEN', '')
            commit('SET_ACCOUNT', '')
            commit('SET_NAME', '')
            commit('SET_AVATAR', '')
            commit('SET_ID', '')
            removeToken()
            resolve()
          }

        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    fedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ACCOUNT', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ID', '')
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    },
    register({commit}, user) {
      return new Promise((resolve, reject) => {
        register(user.account,
          user.nickname,
          user.password,
          user.inviteCode,
          user.mobilePhoneNumber,
          user.verifyNumber).then((data) => {

          if(data.success){
            commit('SET_TOKEN', data.data)
            setToken(data.data)
            resolve()
          }else{
            reject(data.message)
          }
        }).catch((error) => {
          reject(error)
        })
      })
    }
  }
})
