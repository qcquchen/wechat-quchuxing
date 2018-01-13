import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import { SUBMIT_WXPAY } from '../../js/constants'

var app = getApp()

Page({
	data: {
		seat: [{
			number: 1,
			type: false
		}, {
			number: 2,
			type: false
		}, {
			number: 3,
			type: false
		}, {
			number: 4,
			type: false
		}],
		price: 0,
		submit_price: 0,
		insurance: true
	},
	onLoad(){
		const {order_info} = app.globalData.entities
		const { seat }= this.data
		seat.map((json, index) => {
        	if(index == order_info.bookSeats - 1){
        		json.type = !json.type
        	}else{
        		json.type = false
        	}
        })
		this.setData({
			price: order_info.price,
			mine_seat: order_info.bookSeats,
			travelId: order_info.travelId,
			submit_price: order_info.price * order_info.bookSeats + 1,
			people_id: order_info.passengerTravelId,
			seat: seat
		})
	},
	selectSeat:function(e){
        const { currentTarget: { dataset: { id } } } = e
        const { seat, price, insurance } = this.data
        let new_price = 0
        seat.map((json, index) => {
        	if(index == id){
        		json.type = true
        		new_price = json.number * price
        	}else{
        		json.type = false
        	}
        })
        this.setData({
        	seat: seat,
        	submit_price: insurance ? new_price + 1 : new_price
        })
	},
	switchChange: function (e){
	    const { submit_price } = this.data
	    let type = e.detail.value
	    this.setData({
	    	insurance: type,
	    	submit_price: type ? submit_price + 1 : submit_price - 1
	    })
	},
	submit:function(){
		const { submit_price, travelId, seat, price, insurance, people_id } = this.data
		let mine_seat = seat.find(json => json.type == true).number
		const { token, openId } = app.globalData.entities.loginInfo
		passenger_api.postPay({
			data: {
				token: token,
				bookSeats: mine_seat,
				buyingSafety: insurance,
				isWX: true,
				openid: openId,
				travelId: travelId,
				passengerTravelId: people_id
			}
		}).then(json => {
			let data = json.data
			if(data.status != 200){
				wx.showModal({
				  title: '提示',
				  content: SUBMIT_WXPAY[data.status],
				  showCancel: false,
				  success: function(res) {
				    if (res.confirm) {
				      console.log('用户点击确定')
				    }
				  }
				})
				return
			}
			wx.setStorageSync('pay_datails', data)
			util.setEntities({
		      key: 'setTimeNumber',
		      value: 180
		    })
			wx.navigateTo({
				url: `/src/submitorder/confirmOrder?price=${price}`
			})
		})
	}
})
