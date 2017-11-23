import * as api from '../js/api'
import * as util from '../js/utils'
import { appLaunchCheck } from '../js/utils'
import moment from '../js/moment'
import * as constants from '../js/constants'

var app = getApp()
var animation = wx.createAnimation({
  duration: 1000,
    timingFunction: 'ease',
})
Page({
    data: {
        markers: [{
          iconPath: "/resources/others.png",
          id: 0,
          latitude: 23.099994,
          longitude: 113.324520,
          width: 50,
          height: 50
        }],
        polyline: [{
          points: [{
            longitude: 113.3245211,
            latitude: 23.10229
          }, {
            longitude: 113.324520,
            latitude: 23.21229
          }],
          color:"#FF0000DD",
          width: 5,
          dottedLine: false,
          arrowLine: true,
          borderColor: '#000000'
        }],
        video_width: 0,
        video_height: 0,
        latitude: 0,
        longitude: 0,
        animationData: {},
        click: false
      },
      onLoad(){
        let self = this
        wx.getSystemInfo({
          success: function(res) {
            self.setData({
              video_width: res.windowWidth,
              video_height: res.windowHeight
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
          }
        })
      },
      onReady: function (e) {
        this.mapCtx = wx.createMapContext('map')
      },
      animation_big: function(){
        let height = this.data.video_height
        let width = this.data.video_width
        console.log(height,'big-----height--')
        animation.opacity(1).height(height).step()
        this.setData({
          animationData: animation.export(),
          controls: [{
            id: 1,
            iconPath: '/resources/location.png',
            position: {
              left: width/2,
              top: height/2,
              width: 20,
              height: 20
            },
            clickable: true
          }]
        })
      },
      animation_small: function(){
        console.log('small-----')
        let height = this.data.video_height
        let width = this.data.video_width
        animation.opacity(1).height(height - 300).step()
        this.setData({
          animationData: animation.export(),
          controls: [{
            id: 1,
            iconPath: '/resources/location.png',
            position: {
              left: width/2,
              top: height - 400,
              width: 20,
              height: 20
            },
            clickable: true
          }]
        })
      },
      onclick_view(){
        let click = !this.data.click
        click ? this.animation_big() : this.animation_small()
        console.log(click,'------clcik')
        this.setData({
          click: click
        })
      },
      regionchange(e) {
        console.log(e.type)
        if(e.type == 'end'){
          this.mapCtx.getCenterLocation({
          success: function(res){
            console.log(res.longitude,'----111')
            console.log(res.latitude,'----222')
          }
        })
        }
      },
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
      }
    })
