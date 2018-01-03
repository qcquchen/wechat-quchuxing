import * as amapFile from '../../js/amap-wx'
import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'

var app = getApp()

Page({
	data: {
		latitude: 39.5427,
        longitude: 116.2317,
      	video_height: 0,
      	type: 0,
      	markers: [],
      	polyline: [],
      	new_strategy: []
	},
	onLoad(option){
		let self = this
        let myAmapFun = new amapFile.AMapWX({key:'35d96308ca0be8fd6029bd3585064095'})
        const { end_location } = option

        wx.getSystemInfo({
          success: function(res) {
            self.setData({
              video_height: res.windowHeight - 182,
            })
          }
        })

        myAmapFun.getRegeo({
          success:function(data){
            self.setData({
              startLocation: data[0].regeocodeData.addressComponent.streetNumber.location,
              latitude: data[0].latitude,
              longitude: data[0].longitude,
              endLocation: end_location
            })
            self.getLine()
          },
          fail:function(e){
            wx.showToast({
              title: '获取当前位置失败',
              icon: 'success',
              duration: 2000
            })
          }
        })
	},
	selectLine:function(e){
		const { currentTarget: { dataset: { id } } } = e
		this.setData({
			type: id
		})
		util.setEntities({
	        key: 'strategy',
	        value: String(id)
	    })
		this.getLine()
	},
	getLine(){
        const { token } = app.globalData.entities.loginInfo
        const { startLocation, type, endLocation, new_strategy } = this.data
        let start_Location = startLocation.split(',').map(json => Number(json))
        let end_Location = endLocation.split(',').map(json => Number(json))
        let parmas = Object.assign({}, { token: token }, { start: start_Location }, { end: end_Location }, { strategy: Number(type) })
		driver_api.getLine({data: parmas}).then(json => {
			let data = json.data.routes
			const { route } = json.data.routes
			let new_pline = route.reverse()
			if(new_strategy.length == 0){
				let strategy = []
				strategy.push(data.strategy0, data.strategy2, data.strategy9)
				strategy && strategy.map(json => {
					json.distance = json.distance.toFixed(2)
				})
				util.setEntities({
			        key: 'strategy',
			        value: String(strategy[0].strategy)
			    })
				this.setData({
		        	new_strategy: strategy
				})
			}
			this.setData({
				markers: [{
	              iconPath: '../../images/icon_map_star@3x.png',
	              id: 0,
	              longitude: start_Location[0],
	              latitude: start_Location[1],
	              width: 32,
	              height: 50
	            },{
	              iconPath: '../../images/icon_map_end@3x.png',
	              id: 1,
	              longitude: new_pline[0].longitude,
	              latitude: new_pline[0].latitude,
	              width: 32,
	              height: 50
	            }],
	            polyline: [{
		          points: new_pline,
		          color:"#57AD68",
		          width: 10,
		          dottedLine: false,
		          arrowLine: true,
		          borderColor: '#458A53',
		          borderWidth: 1
		        }]
			})
		})
	},
	submit_btn:function(){
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
	}
})