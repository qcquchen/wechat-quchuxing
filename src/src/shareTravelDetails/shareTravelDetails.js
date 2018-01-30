import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import * as amapFile from '../../js/amap-wx'

var app = getApp()
var myAmapFun = new amapFile.AMapWX({key:'35d96308ca0be8fd6029bd3585064095'})

var first_controls = Object.assign({}, {
  id: 1,
  iconPath: '../../images/btn_navig@3x.png',
  position: {
    left: 0,
    top: 180,
    width: 50,
    height: 50
  },
  clickable: true
})

var two_controls = Object.assign({}, {
  id: 2,
  iconPath: '../../images/btn_locate@3x.png',
  position: {
    left: 10,
    top: 180,
    width: 50,
    height: 50
  },
  clickable: true
})

Page({
	data: {
		awardFriends: [],
		travel: {},
		share_info: {},
    controls: [],
		markers: [],
		longitude: 113.324520,
		latitude: 23.099994,
		login_active: false,
    scale: 10
	},
	onShow(){
		wx.showLoading({
		  title: '加载中',
		})
		this.shareTravelDetails()
	},
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('map')
  },
	onLoad(ops){
	    wx.showShareMenu({
	      withShareTicket: true //要求小程序返回分享目标信息
	    })
      const { deviceInfo } = app.globalData.entities
      let map_width = deviceInfo.windowWidth - 60
      first_controls.position.left = map_width
			// ops.travelId = 12916300946015
			// ops.phone = 15920739138
			// ops.travelType = 1
			this.setData({
				options: ops,
        controls:[first_controls, two_controls]
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
				travelType: options.travelType,
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
				  title: '恭喜你获得'+ json.data.likerAward.billMoney +'元现金红包',
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
	          latitude: start[1]
		    })
		}).then(() => {
			setTimeout(function(){
			  wx.hideLoading()
			},2000)
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
		const { userInfo, travel, options } = this.data
    return {
      title: travel.nickname + ' ' + travel.startTimeTxt + ' ' + travel.startAddress + '--->' + travel.endAddress,
      path: `/src/shareTravelDetails/shareTravelDetails?travelId=${options.travelId}&phone=${options.phone}&travelType=${options.travelType}`,
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
						travelType: Number(options.travelType)
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
		const { userInfo, travel, options } = this.data
		if(!userInfo.phone){
			wx.navigateTo({
        url: `/src/login/login`
      })
      return
		}
		wx.showModal({
		  title: '提示',
		  content: '抢单并接送乘客',
		  success: function(res) {
		    if (res.confirm) {
		      driver_api.driverGrabAsingle({
						data:{
							token: userInfo.token,
							passengerTravelId: travel.travelId,
							sharePhone: options.phone
						}
					}).then(json => {
						if(json.data.status === -5){
							wx.showModal({
							  title: '提示',
							  content: '您还未进行车主认证，请认证为车主之后再来哦~',
								confirmText: '去认证',
							  success: function(res) {
							    if (res.confirm) {
										wx.navigateTo({
	                    url: `/src/ownersCertification/ownersCertification`
	                  })
							    }
							  }
							})
							return
						}
						if(json.data.status !== -353){
							wx.showModal({
							  title: '提示',
							  content: json.data.detail,
								confirmText: '确定',
								showCancel: false
							})
						}else{
							wx.showModal({
							  title: '提示',
							  content: json.data.detail + ', 请前往咚咚拼车APP查看',
								confirmText: '知道了',
								showCancel: false
							})
						}
					})
		    } else if (res.cancel) {
		      console.log('用户点击取消')
		    }
		  }
		})
	},
  controltap: function(e){
    const { travel } = this.data
    let self = this
    switch(e.controlId)
    {
    case 1:
    wx.showModal({
      title: '提示',
      content: '选择您要去的位置',
      cancelText: '去起点',
      confirmText: '去终点',
      confirmColor: '#FF7779',
      cancelColor: '#499EFF',
      success: function(res) {
        if (res.confirm) {
          wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
              var latitude = res.latitude
              var longitude = res.longitude
              wx.openLocation({
                latitude: travel.end[1],
                longitude: travel.end[0],
                name: travel.endAddress,
              })
            }
          })
        } else if (res.cancel) {
          wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
              var latitude = res.latitude
              var longitude = res.longitude
              wx.openLocation({
                latitude: travel.start[1],
                longitude: travel.start[0],
                name: travel.startAddress,
                scale: 28
              })
            }
          })
        }
      }
    })
      break;
    default:
      this.mapCtx.moveToLocation()
      self.setData({
        scale: 10
      })
      break;
    }
  }
})
