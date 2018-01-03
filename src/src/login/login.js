import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import * as constants from '../../js/constants'

var app = getApp()

Page({
	data:{
		phone_false: false,
		code_false: false,
		phone: null,
		code: null,
		countdown: '获取验证码',
		phone_type: 'no',
		code_type: 'no'
	},
	inPhone:function(e){
		if(!(/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(e.detail.value))){ 
			this.setData({
				phone_false: true
			})
    	}else{
    		this.setData({
				phone_false: false,
				phone: e.detail,
				phone_type: 'yes'
			})
    	}
	},
	inCode:function(e){
		// if(!(/^\d{6}$/.test(e.detail.value))){      
		// 	this.setData({
		// 		code_false: true
		// 	})
  //       }else{
        	this.setData({
				code_false: false,
				code: e.detail,
				code_type: 'yes'
			})
        // }
	},
	getCode:function(){
		const { phone } = this.data
		if(phone != null){
			this.getSendCaptcha(phone)
		}else{
			wx.showModal({
			  title: '提示',
			  content: '请输入手机号',
			  success: function(res) {
			    if (res.confirm) {
			      console.log('确定')
			    } else if (res.cancel) {
			      console.log('取消')
			    }
			  }
			})
		}
	},
	getSendCaptcha(phone){
		let parmas = Object.assign({}, { phone: phone.value })
		driver_api.postSendCaptcha({
			data: parmas
		}).then(json => {
			let currentTime = moment().set({second: 60})
			let time = setInterval(() => {
				currentTime = moment(currentTime).subtract(1, 'seconds')
				this.setData({
					countdown: moment(currentTime).toDate().pattern('ss') + 's'
				})
				if(moment(currentTime).second() == 0){
					clearInterval(time)
					this.setData({
						countdown: '获取验证码'
					})
				}
			}, 1000)
		}, e =>{
			wx.showToast({
			  title: '发送失败',
			  icon: 'success',
			  duration: 2000
			})
		})
	},
	submit_login(){ 
		const { phone, code } = this.data
		const { openId } = app.globalData.entities.loginInfo
		let parmas = Object.assign({}, { phone: phone.value }, { captcha: code.value }, { openId: openId })
		driver_api.postLogin({data: parmas}).then(json => {
			wx.navigateBack({
			  delta: 1
			})
			json.data.openId = openId
			util.setEntities({
		        key: 'loginInfo',
		        value: json.data
		    })

		    wx.showToast({
			  title: '登录成功',
			  icon: 'success',
			  duration: 2000
			})
		}, e => {
			 wx.showToast({
			  title: '登录失败',
			  icon: 'success',
			  duration: 2000
			})
		})
	}
})