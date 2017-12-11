import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'

var app = getApp()

Page({
	data:{
		userInfo: {}
	},
	onLoad(){
		this.getUserInfo()
	},
	getUserInfo(){
		const { token } = app.globalData.entities.loginInfo
		driver_api.getUserInfo({data:{
			token: token
		}}).then(json => {
			let data = json.data.personalInfo
			this.setData({
				userInfo: data
			})
			console.log(json,'----------------json')
		})
	}
})