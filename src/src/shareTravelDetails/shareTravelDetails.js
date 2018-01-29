import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import * as amapFile from '../../js/amap-wx'

var app = getApp()
var myAmapFun = new amapFile.AMapWX({key:'35d96308ca0be8fd6029bd3585064095'})
Page({
	data: {
		awardFriends: [],
		travel: {},
		share_info: {},
		markers: [],
		longitude: 113.324520,
		latitude: 23.099994,
		login_active: false
	},
	onShow(){
		this.shareTravelDetails()
	},
	onLoad(ops){
	    wx.showShareMenu({
	      withShareTicket: true //要求小程序返回分享目标信息
	    })
			ops.travelId = 12511255705030
			ops.phone = 15920739138
			ops.travelType = 0
			this.setData({
				options: ops
			})
	},
	shareTravelDetails: function(){
		let userInfo = wx.getStorageSync('first_userInfo')
		const { options } = this.data
		if(userInfo.phone){
			this.setData({
				login_active: true
			})
		}
		driver_api.shareTravelDetails({
			data: {
				travelId: options.travelId,
				token: userInfo ? userInfo.token : ''
			}
		}).then(json => {
			let awardFriends = json.data.awardFriends
			let travel = json.data.travel
			let share_info = json.data
			this.setData({
				awardFriends: awardFriends,
				travel: travel,
				share_info: share_info,
				userInfo: userInfo
			})
			this.getLine(travel.start, travel.end, travel.strategy)
		})
	},
	postLike: function(e){
		let self = this
		const { userInfo, travel } = this.data
		if(!userInfo.phone){
			wx.navigateTo({
        url: `/src/login/login`
      })
      return
		}

		driver_api.postLike({
			data:{
				token: userInfo.token,
				travelId: travel.travelId,
				likeSource: 1
			}
		}).then(json => {
			if(json.data.status == 200){
				wx.showModal({
				  title: '恭喜你获得5元现金红包',
				  content: '请使用验证的手机号登录咚咚拼车App，前往我的-钱包页面提现',
				  showCancel: false,
				  confirmText: '知道了',
				  success: function(res) {
				    if (res.confirm) {
						self.shareTravelDetails()
				    }
				  }
				})
			}
		})
	},
	getLine(start, end, strategy){
		driver_api.getLineV1({
			data: {
				start: start,
				end: end,
				strategy: strategy
			}
		}).then(json => {
			let data = json.data.routes
		      this.setData({
		        markers: [{
		          iconPath: '../../images/icon_map_star@3x.png',
		          id: 0,
		          longitude: start[0],
		          latitude: start[1],
		          width: 32,
		          height: 50
		        },{
		          iconPath: '../../images/icon_map_end@3x.png',
		          id: 1,
		          longitude: end[0],
		          latitude: end[1],
		          width: 32,
		          height: 50
		        }],
		        polyline: [{
		          points: data.route,
		          color:"#57AD68",
		          width: 10,
		          dottedLine: false,
		          arrowLine: true,
		          borderColor: '#458A53',
		          borderWidth: 1
		        }],
		        longitude: start[0],
	           	latitude: start[1],
		    })
		})
	},
	submit: function(){
		const { travel, options } = this.data
		let parmas = Object.assign({}, {bookSeats: travel.surplusSeats}, {travelId: travel.travelId}, { price: travel.travelPrice }, { sharePhone: options.phone })
		util.setEntities({
      key: 'order_info',
      value: parmas
    })
    wx.navigateTo({
      url: `/src/submitorder/submitorder`
    })
	},
	isLogin: function(){
		const { login_active } = this.data
		if(!login_active){
			wx.showModal({
				title: '提示',
				content: '您还未登录，不能抢红包哦~',
				showCancel: true,
				confirmText: '去登录',
				success: function(res) {
					if (res.confirm) {
						wx.navigateTo({
			        url: `/src/login/login`
			      })
					}
				}
			})
		}
	},
	onShareAppMessage() {
		const { userInfo, travel } = this.data
    return {
      title: '页面分享标题',
      path: '/src/shareTravelDetails/shareTravelDetails?travelId=12511255705030&phone=15920739138&travelType=0',
      success(res){
    		// 获取微信群ID
        // wx.getShareInfo({
	      //   shareTicket: res.shareTickets[0],
	      //   success(res) {
	      //     console.log(res.encryptedData)
	      //     console.log(res.iv)
	      //     // 后台解密，获取 openGId
	      //   }
	    	// })
	    	driver_api.shareTravel({
					data: {
						token: userInfo.token,
						travelId: travel.travelId,
						travelType: 0
					}
				}).then(json => {
					if(json.data.status == 200){
						wx.showToast({
						  title: '分享成功',
						  icon: 'success',
						  duration: 2000
						})
					}
				})
      }
    }
  },
	grabAsingLe: function(){
		console.log('---------------------')
	}
})
