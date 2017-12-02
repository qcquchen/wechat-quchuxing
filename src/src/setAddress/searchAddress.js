import * as amapFile from '../../js/amap-wx'
import * as util from '../../js/utils'

var key = '35d96308ca0be8fd6029bd3585064095'
var myAmapFun = new amapFile.AMapWX({key: key})
Page({
	data:{
		tips:{},
		city: '',
		type: ''
	},
	onLoad(option){
		let self = this
		const { id } = option
	    let myAmapFun = new amapFile.AMapWX({key: key})
        myAmapFun.getRegeo({
          success:function(data){
            self.setData({
              city: data[0].regeocodeData.addressComponent.province
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

        this.setData({
        	type: id
        })
	},
	searchIn:function(e){
		let self = this
		const { city } = this.data
	    const keywords = e.detail.value
	    const key = '35d96308ca0be8fd6029bd3585064095'
	    myAmapFun.getInputtips({
	      keywords: keywords,
	      location: '',
	      city: city,
	      success: function(data){
	        if(data && data.tips){
				self.setData({
					tips: data.tips
				})
	        }
	      }
	    })

        if(e.detail.cursor == 0){
        	console.log('111')
        	self.setData({
				tips: {}
			})
        }
	},
	bindSearch: function(e){
		const { currentTarget: { dataset: { keywords, location } } } = e
		const { type } = this.data
		wx.redirectTo({
			url: `/src/setAddress/setAddress?keywords=${keywords}&location=${location}`
		})
		util.setEntities({
	        key: 'address_type',
	        value: type
	    })
	}
})