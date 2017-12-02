import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'

var app = getApp()

Page({
	data:{
		type: 'home',
		keywords: ''
	},
	onShow(){
		const { address_type } = app.globalData.entities
		this.setData({
			type: address_type
		})
	},
	onLoad(option){
		const { location, keywords } = option
		this.setData({
			location: location,
			keywords: keywords
		})
		this.detectionAddress()
	},
	detectionAddress:function(){
		const { token } = app.globalData.entities.loginInfo
        driver_api.getSearchAddress({
          data: {
            token: token
          }
        }).then(json => {
          console.log(json,'--------------json')
        })
	},
	setAddress:function(e){
		const { currentTarget: { dataset: { id } } } = e
		wx.redirectTo({
		  url: `/src/setAddress/searchAddress?id=${id}`
		})
	},
	submit_btn:function(){
		const { type, location, keywords } = this.data
		const { token } = app.globalData.entities.loginInfo
		let new_location = location.split(',').map(json => Number(json))
		let parmas = {}
		if( !location && !keywords ){
			wx.showModal({
			  title: '提示',
			  content: '请输入地址',
			  showCancel: false,
			  success: function(res) {
			    if (res.confirm) {
			      console.log('用户点击确定')
			    }
			  }
			})
			return
		}

		if( type == 'home' ){
			parmas = Object.assign({}, { token: token }, {addr_home: keywords}, { location_home: new_location })
			this.submitAddress(parmas)
			return
		}
		if( type == 'company' ){
			parmas = Object.assign({}, { token: token }, {addr_company: keywords}, { location_company: new_location })
			this.submitAddress(parmas)
			return
		}
	},
	submitAddress(parmas){
		driver_api.postHomeAndCompanyAddress({
			data: parmas
		}).then(json => {
			wx.showToast({
			  title: '成功',
			  icon: 'success',
			  duration: 2000
			})

			setTimeout(()=>{
				wx.navigateBack({
				  delta: 1
				})
			}, 2000)
		}, e => {
			wx.showToast({
			  title: '失败',
			  icon: 'success',
			  duration: 2000
			})
		})
	}
})