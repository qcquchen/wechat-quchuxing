import * as passenger_api from './js/passenger_api'
import * as driver_api from './js/driver_api'
import * as util from './js/utils'
import { checkEntities, track, initSystemInfo, getCurrentUser } from './js/utils'
import * as constants from './js/constants'


var appConfig = {
    onLaunch: function () {
      this.getWechatInfo()
    },
    getWechatInfo () {
      let that = this
      wx.showLoading({
        title: '加载中',
      })
      wx.login({
        success (loginres) {
          wx.getUserInfo({
            withCredentials: true,
            success (res) {
              let userInfo = res.userInfo
              that.globalData.wechatInfo = userInfo
              // that.globalData.wechatConfig = res
              util.setStorage({
                key : 'wechatInfo',
                data : userInfo
              })
              userInfo.code = loginres.code
              return that.weChatSignin(userInfo)
            },
            fail () {
              console.log('验证失败')
            }
          })
        },
        fail (err) {
          console.log('wx.login  error ', err)
        }
      })
    },
    globalData: {
      callback       : null,
      unloadCallback : null,
      hasLogin       : false,
      wechatInfo     : null,
      userInfo       : null,
      appLaunch      : false,
      wechatConfig   : {},
      entities       : {
        deviceInfo : wx.getSystemInfoSync()
      }
    },
    weChatSignin (options, cb) {
      const that = this
      const { code } = options
      // const { iv, encryptedData } = that.globalData.wechatConfig
      let parmas = Object.assign({}, {code: code})
      let value = wx.getStorageSync('first_userInfo')
      if(!value.openId){
        driver_api.postWechatLogin({
          data: parmas
        }).then(login_json => {
          let openId = login_json.data.result.Openid
          this.postFindLogin(openId)
        }) 
      }else{
        this.globalData.entities.loginInfo = value
        wx.hideLoading()
      }
    },
    postFindLogin(openId){
      driver_api.postFindLogin({
        data: {
          openId: openId
        }
      }).then(json => {
        let { status } = json.data
        if(status != -1){
          json.data.openId = openId
          this.globalData.entities.loginInfo = json.data
          util.setStorage({
            key : 'first_userInfo',
            data : json.data
          })
        }else{
          this.globalData.entities.loginInfo = {
            openId: openId
          }
        }
      }).then(()=>{
          wx.hideLoading()
      })
    }
}

App(appConfig)

export var app = getApp()
