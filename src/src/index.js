import * as passenger_api from '../js/passenger_api'
import * as driver_api from '../js/driver_api'
import * as util from '../js/utils'
import { appLaunchCheck } from '../js/utils'
import moment from '../js/moment'
import * as constants from '../js/constants'

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
        polyline: [{
          points: [{
            longitude: 116.41688154504395,
            latitude: 39.90475426301773
          }, {
            longitude: 116.41653822229004,
            latitude: 39.91495897331904
          },{
            longitude: 116.40735433862305,
            latitude: 39.91634143003664
          }],
          color:"#FF0000DD",
          width: 15,
          dottedLine: false,
          arrowLine: true,
          borderColor: '#0091ff',
          borderWidth: 5
        }],
        controls: [],
        controls_samll: [],
        video_width: 0,
        video_height: 0,
        latitude: 0,
        longitude: 0,
        imgUrls: [1,2,3,4],
        current: 0,
        time: '12:01',
        seat_number: [1,2,3,4],
        seat_number_index: 0,
        select_price:[10,20,30,40],
        select_price_index: 0,
        journey_active: true,
        homeOfwork: true,
        selectJourney_animation: {},
        hideOfShow_type: ''
      },
      onLoad(){
        let self = this
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

        wx.getLocation({
          type: 'gcj02',
          success: function(res) {
            self.setData({
              latitude: res.latitude,
              longitude: res.longitude
            })
            self.postNearbyOfPeople(res.latitude, res.longitude)
          }
        })
      },
      // initData(){
      //   this.postNearbyOfPeople()
      // },
      onReady: function (e) {
        this.mapCtx = wx.createMapContext('map')
      },
      
      // 显示提交行程code
      goHomeOfWork:function(e){
        const { currentTarget: { dataset: { type } } } = e
        console.log(type,'-------type')
        this.setData({
          hideOfShow_type: type
        })
        this.showSelectHomeOfWork()
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
          homeOfwork: true
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
      }
    })
