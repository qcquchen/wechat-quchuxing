import * as api from '../js/api'
import * as util from '../js/utils'
import { appLaunchCheck } from '../js/utils'
import moment from '../js/moment'
import * as constants from '../js/constants'

var app = getApp()

Page({
  data: {

  },
  onShow () {
    console.log('index,onshow')
  },
  onLoad () {
   appLaunchCheck(this.initData)
  },
  initData (status) {
    console.log('000000')
  },
  bindInvoicePay () {
    api.postWxPay({
      success (res) {
        var data = res.data
        app.globalData.wechatPay = data
        wx.requestPayment({
          timeStamp : data.timeStamp,
          nonceStr  : data.nonceStr,
          package   : data.package,
          signType  : data.signType,
          paySign   : data.paySign,
          success (res) {
            wx.showToast({
              title: '支付成功！',
              icon: 'success',
              duration: 2000
            })
          },
          fail (error) {
            console.log('error ', error)
            wx.showToast({
              title: '支付失败！',
              icon: 'success',
              duration: 2000
            })
          },
          complete () {

          }
        })
      },
      fail (res) {
        console.log('fail  ',res)
      }
    })
  }
})
