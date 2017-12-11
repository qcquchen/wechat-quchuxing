import * as amapFile from '../../js/amap-wx'
import * as driver_api from '../../js/driver_api'

Page({
	data: {
		video_width: 0,
        video_height: 0,
        latitude: 0,
      	longitude: 0,
      	group: {},
      	homeOfWork: [],
      	findData: [],
      	detail_people: {},
      	detail_meeting: {},
      	details_id: null
	},
	onLoad(option){
		let self = this
        let myAmapFun = new amapFile.AMapWX({key:'35d96308ca0be8fd6029bd3585064095'})
          wx.getSystemInfo({
	          success: function(res) {
	            self.setData({
	              video_width: res.windowWidth,
	              video_height: res.windowHeight
	            })
	          }
          })

        myAmapFun.getRegeo({
          success:function(data){
            self.setData({
              startAddress: data[0].regeocodeData.formatted_address,
              startLocation: data[0].regeocodeData.aois[0].location,
              latitude: data[0].latitude,
              longitude: data[0].longitude,
            })
          },
          fail:function(e){
            wx.showToast({
              title: '获取当前位置失败',
              icon: 'success',
              duration: 2000
            })
          }
        })
        this.initData(option)
	},
	initData(option){
		const { id } = option
		console.log(id,'----------------id')
		driver_api.getGroupInfo({
			data: {
				groupId: id
			}
		}).then(json => {
			let data = json.data.result
			if(data.type != 2){
				this.getGroupDetails(data.groupId)
			}else{
				this.getMeetingGroupDetails(null, data.groupId)
			}
			this.setData({
				group: data
			})
		})
	},
	getGroupDetails(id){
		driver_api.getGroupDetails({
			data:{
				groupId: id
			}
		}).then(json => {
			let data = json.data.result
			let new_data = []
			data && data.map((json, index) => {
				json.id = index + 1
				new_data.push({
					id: index + 1,
					img: json.driverPicture
				})
			})
			this.setData({
				homeOfWork: data,
				findData: new_data
			})
			this.findPeopleDetails(null, data)
		})
	},
	getMeetingGroupDetails(e, id){
		let type = e ? e.currentTarget.dataset.type : 1
		driver_api.getGroupDetails({
			data:{
				groupId: id,
				typeWant: type
			}
		}).then(json => {
			let data = json.data.result
			let new_data = []
			data && data.map((json, index) => {
				json.id = index + 1
				new_data.push({
					id: index + 1,
					img: json.driverPicture
				})
			})
			this.setData({
				meeting: data,
				findData: new_data
			})
			this.findMeetingDetails(null, data)
		})
	},
	findPeopleDetails: function(e, data){
		let id =  e ? e.currentTarget.dataset.id : data[0].id
		const { homeOfWork } = this.data
		let detail_people = homeOfWork && homeOfWork.find(json => json.id == id)
		this.setData({
			detail_people: detail_people,
			details_id: id
		})
	},
	findMeetingDetails: function(e, data){
		let id =  e ? e.currentTarget.dataset.id : data[0].id
		const { meeting } = this.data
		let detail_meeting = meeting && meeting.find(json => json.id == id)
		this.setData({
			detail_meeting: detail_meeting,
			details_id: id
		})
	}
})