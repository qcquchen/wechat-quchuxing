import * as passenger_api from '../../js/passenger_api'
import * as driver_api from '../../js/driver_api'
import * as util from '../../js/utils'
import moment from '../../js/moment'
import * as amapFile from '../../js/amap-wx'

var app = getApp()

Page({
	data:{
		    video_width: 0,
        video_height: 0,
        latitude: 0,
      	longitude: 0,
        isMatchingTravel: 0,
        isMatch: false,
        match_cars: [],
        matchCar: {},
        car_id: null,
        match_active: 'car',
        seat_img: [{
          img_true: '../../images/icon_seat_have@3x.png',
          img_false: '../../images/icon_seat@3x.png',
          type: true
        },{
          img_true: '../../images/icon_seat_have@3x.png',
          img_false: '../../images/icon_seat@3x.png',
          type: true
        },{
          img_true: '../../images/icon_seat_have@3x.png',
          img_false: '../../images/icon_seat@3x.png',
          type: true
        },{
          img_true: '../../images/icon_seat_have@3x.png',
          img_false: '../../images/icon_seat@3x.png',
          type: true
        }],
        startLocation: [],
        code_type: 'owner',
        orderInfo: {},
        booked_active: 'shun',
        shunPassengers: {},
        people_info: {},
        people_id: null
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
	       self.setMarkers()
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
		let { type, id, seat } = option
    const { token } = app.globalData.entities.loginInfo
    this.setData({
      match_id: id,
      seat: seat,
      code_type: type
    })
		if(type == 'passenger'){
			this.postMatchCompany(id, token)
		}
    if(type == 'owner'){
      this.postMatchPeople(id, token, type)
    }
		if(type == 'details'){
    	const { order_info } = app.globalData.entities
			this.getOrderInfo(order_info)
		}
	},
	//设置maker点
	setMarkers(){
		const { startLocation } = this.data
		const location_end = app.globalData.entities
		let start_Location = startLocation.split(',').map(json => Number(json))
		this.setData({
			samll_markers: [{
        iconPath: '../../images/icon_map_star@3x.png',
        id: 0,
        longitude: start_Location[0],
        latitude: start_Location[1],
        width: 32,
        height: 50,
        title: '第一个',
        anchor: {x: .5, y: .5}
      },{
        iconPath: '../../images/icon_map_end@3x.png',
        id: 1,
        longitude: location_end[0],
        latitude: location_end[0],
        width: 32,
        height: 50,
        title: '第一个',
        anchor: {x: .5, y: .5}
      }]
		})
	},
	//  乘客匹配车主
	postMatchCompany(id, token){
    let parmas = Object.assign({}, {token: token}, {passengerTravelId: id}, {pageNum: 1})
    passenger_api.postMatchCompany({data: parmas}).then(json => {
      const { matchTravel } = json.data
      let data = json.data.matchTravel.travelResults
      this.setData({
        isMatchingTravel: matchTravel.isMatchingTravel,
        match_cars: data
      })
      console.log(data,'------------data')
      if(data.length != 0){
        this.matchCarsInfo(null, data[0].travelId)
      }
    }, e=>{
      wx.showToast({
        title: '匹配失败',
        icon: 'success',
        duration: 2000
      })
    })
	},
	matchCarsInfo(e, car_id){
	    const { match_cars, seat_img } = this.data
	    let id =  e ? e.currentTarget.dataset.id : car_id
	    let new_match = match_cars.find(data => data.travelId == id)
	    seat_img.map((json, index) => {
	      if((index + 1) <= new_match.surplusSeats){
	        json.type = false
	      }
	    })
	    this.setData({
	      matchCar: new_match,
	      car_id: id,
	      seat_img: seat_img
	    })
	},
	matchCar:function(){
    const { token } = app.globalData.entities.loginInfo
    const {match_id} = this.data
    this.postMatchCompany(match_id, token)
		this.setData({
		  match_active: 'car'
		})
	},
	matchPeople:function(){
    const { token } = app.globalData.entities.loginInfo
    const {match_id, type} = this.data
    this.postMatchPeople(match_id, token, type)
		this.setData({
		  match_active: 'people'
		})
	},
  	// 乘客or车主匹配乘客
	postMatchPeople(travelId, token, type){
		let role = 0
    switch (type)
    {
      case 'passenger':
        role = 0
      break;
      case 'owner':
        role = 1
      break;
    }
		let parmas = Object.assign({}, { token: token }, { role: role }, { travelId: travelId }, { pageNum: 1 })
	  passenger_api.postMatchPeople({data: parmas}).then(json => {
	    // 匹配过程处理
      const { isMatch, matchTravelPassengers } = json.data.matchTravelPassengers
      this.setData({
        isMatch: isMatch,
        shunPassengers: matchTravelPassengers,
        people_id: matchTravelPassengers[0].passengerTravelId
      })
      this.peopleDetails(null, matchTravelPassengers[0].passengerTravelId)
	  }, e=>{
	    wx.showToast({
	      title: '匹配失败',
	      icon: 'success',
	      duration: 2000
	    })
	  })
	},
  peopleDetails(e, people_id){
    const { shunPassengers } = this.data
    let id = e ? e.currentTarget.dataset.id : people_id
    let new_match = shunPassengers.find(data => data.passengerTravelId == id)
    this.setData({
      people_info: new_match
    })
  },
	submitOrder:function(){
		const { seat, car_id, matchCar } = this.data
		let parmas = Object.assign({}, {bookSeats: Number(seat)}, {travelId: car_id}, { price: matchCar.price })
		util.setEntities({
          key: 'order_info',
          value: parmas
        })
        wx.navigateTo({
          url: `/src/submitorder/submitorder`
        })
	}, 
	getOrderInfo(data){
		const { travelId } = data
		const { phone } = app.globalData.entities.loginInfo
		let parmas = Object.assign({}, {travelId: travelId}, { phone: phone })
		driver_api.getOrderInfo({data: parmas}).then(json => {
			let data = json.data
			this.setData({
				orderInfo: data
			})
		})
	},
  // 车主匹配切换按钮
  booked(){
    const {match_id} = this.data
    const { token } = app.globalData.entities.loginInfo
    this.getBookedPeople(match_id, token)
    this.setData({
      booked_active: 'car'
    })
  },
  shun_passengers(){
    const { token } = app.globalData.entities.loginInfo
    const {match_id} = this.data
    this.postMatchPeople(match_id, token)
    this.setData({
      booked_active: 'shun'
    })
  },
  getBookedPeople(id, token){
    driver_api.getBookedPeople({
      data: {
        travelId: id,
        token: token
      }
    }).then(json => {
      console.log(json,'----------------json')
    })
  },
  // 关注
  attention: function(){

  },
  go_car_phone: function(){
    const { match_cars } = this.data
    console.log(match_cars,'---------------???')
    // wx.makePhoneCall({
    //   phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    // })
  }
})