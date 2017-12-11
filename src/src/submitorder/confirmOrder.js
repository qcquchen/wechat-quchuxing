import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'

var app = getApp()

Page({
	data:{
		countdown: 180,
		order: {},
		price: 0
	},
	onLoad(option){
		const data = app.globalData.entities.pay_datails
		const { price } = option
		this.setData({
			order: data,
			price: price
		})
		this.setIntervalTime()
	},
	setIntervalTime:function(){
		let second = 180
		let time = setInterval(() => {
			second = second - 1 
			this.setData({
				countdown: second
			})
			if(second <= 0){
				clearInterval(time)
			}
		}, 1000)
	},
	postWxPay(){
		const { order } = this.data
		util.toPay(order).then(res => {
			setTimeout(() => {
				wx.navigateTo({
					url: `/src/match/match?type=details`
				})
			}, 2000)
		}, () => {
		 //    _this.setData({
			//     submitBtnLoading: false
			// })
			// util.track(`用户微信支付失败`)
		})
	}
})