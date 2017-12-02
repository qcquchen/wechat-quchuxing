import * as passenger_api from '../js/passenger_api'
import * as driver_api from '../js/driver_api'
import * as util from '../js/utils'
import { appLaunchCheck } from '../js/utils'
import moment from '../js/moment'
import * as constants from '../js/constants'
import { SELECT_TIME_DAY, SELECT_TIME_HOUR, SELECT_TIME_MINUTE } from '../js/constants'
import * as amapFile from '../js/amap-wx'

var app = getApp()

var animation = wx.createAnimation({
  duration: 900,
  timingFunction: 'ease'
})

var first_controls = Object.assign({}, {
  id: 1,
  iconPath: '../images/icon_circle_like_comment@3x.png',
  position: {
    left: 0,
    top: 0,
    width: 20,
    height: 20
  },
  clickable: true
})

var two_controls = Object.assign({}, {
  id: 2,
  iconPath: '../images/icon_home_me@3x.png',
  position: {
    left: 10,
    top: 15,
    width: 50,
    height: 50
  },
  clickable: true
})

var three_controls = Object.assign({}, {
  id: 3,
  iconPath: '../images/icon_home_group@3x.png',
  position: {
    left: 10,
    top: 80,
    width: 50,
    height: 50
  },
  clickable: true
})

var four_controls = Object.assign({}, {
  id: 4,
  iconPath: '../images/icon_home_msg@3x.png',
  position: {
    left: 10,
    top: 145,
    width: 50,
    height: 50
  },
  clickable: true
})

var five_controls = Object.assign({}, {
  id: 5,
  iconPath: '../images/btn_locate@3x.png',
  position: {
    left: 15,
    top: 15,
    width: 50,
    height: 50
  },
  clickable: true
})

Page({
      data: {
        markers: [],
        samll_markers: [],
        polyline: [],
        controls: [],
        controls_samll: [],
        video_width: 0,
        video_height: 0,
        latitude: 0,
        longitude: 0,
        imgUrls: [1,2,3,4],
        current: 0,
        seat_number: ['1个座位', '2个座位', '3个座位', '4个座位'],
        seat_number_index: 0,
        select_price:[5, 8, 10, 30],
        select_price_index: 0,
        journey_active: true,
        homeOfwork: true,
        selectJourney_animation: {},
        hideOfShow_type: '',
        switch_identity: 'passenger',
        btn_hideOfShow: 'show',
        timeArray: [SELECT_TIME_DAY, SELECT_TIME_HOUR, SELECT_TIME_MINUTE],
        timeIndex: [0, 0, 0],
        match: true ,
        match_active: 'car',
        strategy_active: '时间最短',
        strategy: 0,
        isHaveSeats: 0,
        isMatchingTravel: 0
      },
      onShow(){
        const { strategy } = app.globalData.entities
        switch (strategy)
        {
          case 0:
            this.setData({
              strategy_active: '时间最短'
            })
            break;
          case 2:
            this.setData({
              strategy_active: '距离最短'
            })
            break;
          case 9:
            this.setData({
              strategy_active: '拥堵较少'
            })
            break;
        }
        this.setData({
          strategy: strategy
        })
      },
      onLoad(){
        this.initData()
      },
      initData(){
        let self = this
        let myAmapFun = new amapFile.AMapWX({key:'35d96308ca0be8fd6029bd3585064095'})
        wx.getSystemInfo({
          success: function(res) {
            first_controls.position.left = res.windowWidth/2
            first_controls.position.top = (res.windowHeight - 84)/2
            two_controls.position.left = res.windowWidth - 65
            three_controls.position.left = res.windowWidth - 65
            four_controls.position.left = res.windowWidth - 65
            five_controls.position.top = res.windowHeight - ( 84 + 65 )
            self.setData({
              video_width: res.windowWidth,
              video_height: res.windowHeight - 84,
              controls:[two_controls, three_controls, four_controls, five_controls]
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
            self.postNearbyOfPeople(data[0].latitude, data[0].longitude)
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
      onReady: function (e) {
        this.mapCtx = wx.createMapContext('map')
      },
      
      // 显示提交行程code
      goHomeOfWork:function(e){
        const phone = app.globalData.entities.loginInfo.phone
        const { currentTarget: { dataset: { type, id } } } = e
        if(!phone){
          wx.navigateTo({
            url: `/src/login/login`
          })
          return
        }
        this.getSearchAddress(type, id)
      },
      getSearchAddress:function(type, id){
        const { token } = app.globalData.entities.loginInfo
        driver_api.getSearchAddress({
          data: {
            token: token
          }
        }).then(json => {
            const { data:{ result: { addr_home, location_home, addr_company, location_company } } } = json
            if(addr_home == null || location_home == null){
              wx.navigateTo({
                url: `/src/setAddress/setAddress`
              })
              util.setEntities({
                  key: 'address_type',
                  value: 'home'
              })
              return
            }
            if(addr_company == null || location_company == null){
              wx.navigateTo({
                url: `/src/setAddress/setAddress`
              })
              util.setEntities({
                  key: 'address_type',
                  value: 'company'
              })
              return
            }
            this.setData({
              location_home: location_home,
              addr_home: addr_home,
              location_company: location_company,
              addr_company: addr_company
            })
            this.goHomeOfWorkInitData(type, id)
        })
      },
      goHomeOfWorkInitData:function(type, id){
        let new_timeArray = []
        const { timeArray } = this.data
        timeArray[0].map(json => {
          new_timeArray.push(moment().add(json - 1, 'days').toDate().pattern('MM月dd日'))
        })

        timeArray[1].map((json, index) => {
          if(json < 10){
            timeArray[1][index] = '0' + json + '时'
          }else{
            timeArray[1][index] = json+'时'
          }
        })

        timeArray[2].map((json, index) => {
          if(json == 0){
            timeArray[2][index] = '0'+json+'分'
          }else{
            timeArray[2][index] = json+'分'
          }
        })
        let now_hour = moment().hour()
        new_timeArray.splice(0,0,'今天')
        new_timeArray.splice(1,1,'明天')
        new_timeArray.splice(2,2,'后天')
        timeArray.splice(0,1,new_timeArray)
        this.setData({
          switch_identity: 'passenger',
          btn_hideOfShow: 'hide',
          timeArray: timeArray,
          travelType: id,
          hideOfShow_type: type
        })
        this.passenger()
        this.showSelectHomeOfWork()
      },
      commit_journey:function(){
        const { timeIndex, timeArray, seat_number_index, select_price_index, location_company, addr_company,  travelType, startLocation, startAddress, addr_home, location_home, switch_identity, select_price, strategy } = this.data
        let new_timeArray = []
        const { token } = app.globalData.entities.loginInfo
        SELECT_TIME_DAY.map((json, index) => {
          new_timeArray.push(moment().add(json - 1, 'days').toDate().pattern('yyyy-MM-dd'))
        })
        let new_day = new_timeArray[timeArray[0].findIndex(json => json == timeArray[0][timeIndex[0]])]
        let new_hour = SELECT_TIME_HOUR[timeArray[1].findIndex(json => json == timeArray[1][timeIndex[1]])]
        let new_minute = SELECT_TIME_MINUTE[timeArray[2].findIndex(json => json == timeArray[2][timeIndex[2]])]
        let new_time = new_day + ' ' + new_hour + ':' + new_minute + ':00' 
        let start_Location = startLocation.split(',').map(json => Number(json))
        let parmas = {}
        if(switch_identity == 'passenger'){
          parmas = Object.assign({}, {token: token}, {startTimes: [new_time]}, {seats: Number(seat_number_index) + 1}, {travelType: Number(travelType)}, {start: start_Location}, {startAddress: startAddress}, {end: location_home}, {endAddress: addr_home}, {isWX: true})
          this.postJounrey(parmas)
        }
        if(switch_identity == 'Owners'){
          parmas = Object.assign({}, {token: token}, {startTimes: [new_time]}, {seats: Number(seat_number_index) + 1}, {travelType: Number(travelType)}, {start: start_Location}, {startAddress: startAddress}, {end: location_company}, {endAddress: addr_company}, { price: select_price[select_price_index] }, {isWX: true}, {strategy: strategy})
          this.postJounreyCar(parmas)
        }
      },
      postJounrey(parmas){
        passenger_api.postJounrey({
          data: parmas
        }).then(json => {
          const { passengerTravelId } = json.data.passengerTravelId
          wx.showToast({
            title: '发布成功',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            match: false,
            hideOfShow_type: 'match'
          })
          this.postMatchCompany(passengerTravelId)
        }, e => {
          wx.showToast({
            title: '发布失败',
            icon: 'success',
            duration: 2000
          })
        })
      },
      postMatchCompany(id){
        const { token } = app.globalData.entities.loginInfo
        let parmas = Object.assign({}, {token: token}, {passengerTravelId: id}, {pageNum: 1})
        let match = setInterval(() =>{
          passenger_api.postMatchCompany({data: parmas}).then(json => {
            const { matchTravel } = json.data
            if(matchTravel.isHaveSeats == 1 &&  matchTravel.isMatchingTravel == 1){
              clearInterval(match)
              this.setData({
                isHaveSeats: matchTravel.isHaveSeats,
                isMatchingTravel: matchTravel.isMatchingTravel
              })
              console.log('-----------匹配到了')
            }
          }, e=>{
            wx.showToast({
              title: '匹配失败',
              icon: 'success',
              duration: 2000
            })
          })
        }, 5000) 
      },
      postJounreyCar(parmas){
        driver_api.postCompanyJonrey({data: parmas}).then(json => {
          // 车主发布行程
          console.log(json,'----------------json')
        })
      },
      showSelectHomeOfWork(){
        let height = this.data.video_height
        let width = this.data.video_width
        five_controls.position.top = height - ( 341 - 15 )

        const showSelectHomeOfWork_animation = animation
        showSelectHomeOfWork_animation.opacity(1).height(340).step()
        this.setData({
          selectJourney_animation: showSelectHomeOfWork_animation.export(),
          controls_samll:[five_controls],
          homeOfwork: false
        })
      },
      // 隐藏提交行程code
      hideCode(){
        this.hideSelectHomeOfWork()
        this.setData({
          homeOfwork: true,
          btn_hideOfShow: 'show',
          match: true,
          timeArray: [SELECT_TIME_DAY, SELECT_TIME_HOUR, SELECT_TIME_MINUTE]
        }) 
      },
      hideSelectHomeOfWork(){
        const hideSelectHomeOfWork_animation = animation
        hideSelectHomeOfWork_animation.opacity(0).height(1).step()
        this.setData({
          selectJourney_animation: hideSelectHomeOfWork_animation.export()
        })
      },
      // 改变中心点附近的乘客
      // regionchange(e) {
      //   let self = this
      //   if(e.type == 'end'){
      //     this.mapCtx.getCenterLocation({
      //     success: function(res){
      //       self.postNearbyOfPeople(res.latitude, res.longitude)
      //     }
      //   })
      //   }
      // },
      markertap(e) {
        console.log(e.markerId)
      },
      controltap(e) {
        console.log(e.controlId)
        switch(e.controlId)
        {
        case 1:
          console.log('中心点')
          break;
        case 2:
          console.log('左边点')
          break;
        default:
          console.log('右边点')
        }
      },
      postNearbyOfPeople(lat, lon){
        let location = []
        let markers_clone = []
        location.push(lon, lat)
        let parmas = Object.assign({}, {location: location})
        driver_api.postNearbyOfPeople({
          data: parmas
        }).then(json => {
          let data = json.data.persons
          const { markers } = this.data
          data && data.map(mak => {
            markers_clone.push({
              iconPath: mak.role == 0 ? '../images/icon_map_men@3x.png' : '../images/icon_map_car@3x.png',
              id: 0,
              longitude: mak.gaodeLocation[0],
              latitude: mak.gaodeLocation[1],
              width: mak.role == 0 ? 50 : 30,
              height: 50,
              title: '第一个',
              anchor: {x: .5, y: .5}
            })
            this.setData({
              markers: markers_clone
            })
          })
        })
      },
      durationChange: function(e) {
        console.log(e,'----------e')
        this.setData({
          duration: e.detail.value
        })
      },
      passenger:function(){
        const { travelType } = this.data
        const { token } = app.globalData.entities.loginInfo
        let parmas = Object.assign({}, { token: token }, { travelType: Number(travelType) })
        passenger_api.getPassengerRecentTrip({
          data: parmas
        }).then(json => {
          const { timeArray } = this.data
          let data = json.data
          let hour_index = moment(data.startTime).hour()
          if( data.startTime ){
            let data_index = 0
            let minute_index = 0 

            timeArray[0].splice(0,0, moment().toDate().pattern('MM月dd日'))
            timeArray[0].splice(1,1, moment().add(1, 'days').toDate().pattern('MM月dd日'))
            timeArray[0].splice(2,2, moment().add(2, 'days').toDate().pattern('MM月dd日'))

            let data_time = moment(data.startTime).toDate().pattern('MM月dd日')
            let data_time_minute = moment(data.startTime).toDate().pattern('mm分')

            timeArray[0].map((json, index) => {
              if(data_time == json){
                data_index = index
              }
            })

            timeArray[2].map((json, index) => {
              if(data_time_minute == json){
                minute_index = index
              }
            })
            this.setData({
              timeIndex: [data_index, hour_index, minute_index],
              seat_number_index: data.seats - 1
            })
          }else{
            this.setData({
              timeIndex: [0, hour_index, 0],
              seat_number_index: 0,
              select_price_index: 0
            })
          }
        })
        this.getLine('passenger')
        this.setData({
          switch_identity: 'passenger'
        })
      },
      owners:function(){
        const { travelType } = this.data
        const { token } = app.globalData.entities.loginInfo
        let parmas = Object.assign({}, { token: token }, { travelType: Number(travelType) })
        const { timeArray, select_price } = this.data
        driver_api.postRecentTrip({
          data: parmas
        }).then(json => {
          let data = json.data
          let hour_index = moment(data.startTime).hour()
          if( data.startTime ){
            let data_index = 0
            let minute_index = 0
            timeArray[0].splice(0,0, moment().toDate().pattern('MM月dd日'))
            timeArray[0].splice(1,1, moment().add(1, 'days').toDate().pattern('MM月dd日'))
            timeArray[0].splice(2,2, moment().add(2, 'days').toDate().pattern('MM月dd日'))
            let data_time = moment(data.startTime).toDate().pattern('yyyy年MM月dd日 HH:mm:ss')
            let data_time_minute = moment(data.startTime).toDate().pattern('mm分')
            timeArray[0].map((json, index) => {
              if(data_time == json){
                data_index = index
              }
            })

            timeArray[2].map((json, index) => {
              if(data_time_minute == json){
                minute_index = index
              }
            })
            let select_price_index = select_price.findIndex(json => data.travelPrice == json)
            this.setData({
              timeIndex: [data_index, hour_index, minute_index],
              seat_number_index: data.seats - 1,
              select_price_index: select_price_index
            })
          }else{
            this.setData({
              timeIndex: [0, hour_index, 0],
              seat_number_index: 0,
              select_price_index: 0
            })
          }
        })
        this.getLine('Owners')
        this.setData({
          switch_identity: 'Owners'
        })
      },
      selectLine:function(){
        const { location_company, location_home, travelType } = this.data
        switch (Number(travelType))
        {
          case 2:
            wx.navigateTo({
              url: `/src/ownersSelectLine/ownersSelectLine?end_location=${location_home}`
            })
            break;
          case 1:
            wx.navigateTo({
              url: `/src/ownersSelectLine/ownersSelectLine?end_location=${location_company}`
            })
            break;
        }
      },
      bindMultiPickerChange: function (e) {
        this.setData({
          timeIndex: e.detail.value
        })
      },
      bindMultiPickerColumnChange: function (e) {
        const { timeArray, timeIndex } = this.data
        timeIndex[e.detail.column] = e.detail.value
        this.setData({
          timeIndex: timeIndex
        })
      },
      bindPickerChange_Seats: function(e) {
        this.setData({
          seat_number_index: e.detail.value
        })
      },
      bindPickerChange_Price: function(e) {
        this.setData({
          select_price_index: e.detail.value
        })
      },
      getLine:function(type){
        const { token } = app.globalData.entities.loginInfo
        const { startLocation, location_company, location_home, travelType } = this.data
        let start_Location = startLocation.split(',').map(json => Number(json))
        let parmas = {}
        if(type == 'passenger'){
          parmas = Object.assign({}, {token: token}, {start: start_Location}, {end: travelType == '2' ? location_home : location_company}, {strategy: 0})
        }else if(type == 'Owners'){
          parmas = Object.assign({}, {token: token}, {start: start_Location}, {end: travelType == '2' ? location_home : location_company}, {strategy: 0})
        }
        
        driver_api.getLine({
          data: parmas
        }).then(json => {
          const { route } = json.data.routes
          let new_pline = route.reverse()
          this.setData({
            samll_markers: [{
              iconPath: '../images/icon_map_star@3x.png',
              id: 0,
              longitude: start_Location[0],
              latitude: start_Location[1],
              width: 32,
              height: 50,
              title: '第一个',
              anchor: {x: .5, y: .5}
            },{
              iconPath: '../images/icon_map_end@3x.png',
              id: 1,
              longitude: new_pline[0].longitude,
              latitude: new_pline[0].latitude,
              width: 32,
              height: 50,
              title: '第一个',
              anchor: {x: .5, y: .5}
            }]
          })
        })
      },
      matchCar:function(){
        this.setData({
          match_active: 'car'
        })
      },
      matchPeople:function(){
        this.setData({
          match_active: 'people'
        })
      }
    })
