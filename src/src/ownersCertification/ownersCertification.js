import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'

var app = getApp()

Page({
	data: {

	},
	onLoad(){

	},
	getCarCode: function(e){
		this.setData({
			car_code: e.detail.value
		})
	},
	getCarModel: function(e){
		this.setData({
			car_model: e.detail.value
		})
	},
	getCarColor: function(e){
		this.setData({
			car_color: e.detail.value
		})
	},
	getDriverLicense: function () {  
		let self = this
	    wx.chooseImage({
		  success: function(res) {
		    var tempFilePaths = res.tempFilePaths
		    self.setData({
		    	driver_licence: tempFilePaths
		    })
		  }
		}) 
	},
	submitDriverLicense: function(){
		const { driver_licence } = this.data
	    wx.uploadFile({
	      url: 'https://v1.driver.quchuxing.com.cn/driver/upload/audit_weapp', 
	      filePath: driver_licence ? driver_licence[0] : '',
	      name: 'driverLicencePictureMain',
	      header: {
	      	'content-type': 'multipart/form-data'
	      },
	      success: function(res){
	       
	      }
	    })
	},
	getDrivingLicense: function () {  
		let self = this
	    wx.chooseImage({
		  success: function(res) {
		    var tempFilePaths = res.tempFilePaths
		    self.setData({
		    	driving_licence: tempFilePaths
		    })
		  }
		}) 
	},
	submitDrivingLicense: function(){
		const { driver_licence } = this.data
	    wx.uploadFile({
	      url: 'https://v1.driver.quchuxing.com.cn/driver/upload/audit_weapp', 
	      filePath: driver_licence ? driver_licence[0] : '',
	      name: 'drivingLicensePictureMain',
	      header: {
	      	'content-type': 'multipart/form-data'
	      },
	      success: function(res){
	       
	      }
	    })
	},
	submit: function(){
		const { car_code, car_model, car_color, DriverLicense, DrivingLicense } = this.data
        const { token } = app.globalData.entities.loginInfo
        if(!car_code){
	        wx.showModal({
	          title: '提示',
	          content: '请输出车牌号',
	          showCancel: false,
	          success: function(res) {
	            if (res.confirm) {
	              console.log('')
	            }
	          }
	        })
	        return
	    }
	    if(!car_model || !car_color){
	        wx.showModal({
	          title: '提示',
	          content: '请填写正确的车型和车体颜色',
	          showCancel: false,
	          success: function(res) {
	            if (res.confirm) {
	              console.log('')
	            }
	          }
	        })
	        return
	    }
        let parmas = Object.assign({}, {token: token}, {drivingLicensePictureMain: DrivingLicense}, {driverLicencePictureMain: DriverLicense}, {carNumber: car_code}, {car: car_model + car_color}, {carMaster: '屈晨'})
		driver_api.postCarInfo({data: parmas}).then(json => {
			let data = json.data
			// if(data.status == -2){
				this.submitDrivingLicense()
				this.submitDriverLicense()
				wx.showToast({
				  title: '成功',
				  icon: 'success',
				  duration: 2000
				})
				setTimeout(()=>{
					wx.navigateBack({
					  delta: 2
					})
				}, 2000)
			// }
		})
	}
})