import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'

var app = getApp()

Page({
	data:{
		countdown: app.globalData.entities.setTimeNumber || 180,
		order: {},
		price: 0
	},
	onLoad(option){
		let pay_datails = wx.getStorageSync('pay_datails')
		const { price } = option
		console.log(pay_datails,'---------------pay_datails')
		this.setData({
			order: pay_datails,
			price: price
		})
		this.setIntervalTime()
	},
	setIntervalTime:function(){
		let second = app.globalData.entities.setTimeNumber || 180
		let time = setInterval(() => {
			second = second - 1
			this.setData({
				countdown: second
			})
			util.setEntities({
		      key: 'setTimeNumber',
		      value: second
		    })
			if(second <= 0){
				clearInterval(time)
				wx.reLaunch({
				  url: `/src/index`
				})
			}
		}, 1000)
	},
	postWxPay(){
		const { order } = this.data
		util.toPay(order).then(res => {
			setTimeout(() => {
				wx.redirectTo({
					url: `/src/match/match?type=details&id=${order.travelId}&travelType=1`
				})
			}, 2000)
		}, () => {
		 	//    _this.setData({
			//     submitBtnLoading: false
			// })
			// util.track(`用户微信支付失败`)
		})
	},
	closeWxPay: function(){
		const { order } = this.data
		const { token } = app.globalData.entities.loginInfo
		passenger_api.closeWxPay({
			data: {
				ordersId: order.ordersId,
				token: token
			}
		}).then(json => {
			wx.showToast({
			  title: '取消成功',
			  icon: 'success',
			  duration: 2000
			})
			setTimeout(() => {
				wx.reLaunch({
					url: `/src/index`
				})
			}, 2000)
		})
	}
})
