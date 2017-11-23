import * as api from './js/api'
import * as util from './js/utils'
import { checkEntities, track, initSystemInfo, getCurrentUser } from './js/utils'
import * as constants from './js/constants'


var appConfig = {
    onLaunch: function () {
      console.log('小程序生成完毕！')
      this.getWechatInfo()
    },
    getWechatInfo () {
      let that = this
      wx.login({
        success (loginres) {
          wx.getUserInfo({
            withCredentials: true,
            success (res) {
              let userInfo = res.userInfo
              that.globalData.wechatInfo = userInfo
              that.globalData.wechatConfig = res
              util.setStorage({
                key : 'wechatInfo',
                data : userInfo
              })
              userInfo.code = loginres.code
              return that.weChatSignin(userInfo)
            },
            fail () {
              wx.reLaunch({
                url: '/src/unauthorized/unauthorized'
              })
              reject()
            }
          })
        },
        fail (err) {
          console.log('wx.login  error ', err)
          reject()
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
    _login () {

    },
    weChatSignin (options, cb) {
      const that = this
      const { code } = options
      const { iv, encryptedData } = that.globalData.wechatConfig
      console.log(options,'---------------',this.globalData.wechatConfig)
    }
}

App(appConfig)

export var app = getApp()
