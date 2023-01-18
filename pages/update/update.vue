<template>
  <view class="content">
    <view class="summary-wrap">
        <!-- <view v-if="hasNewVersion" class="highlight">有新版本，请下载新的版本安装，当前版本为V{{ $global.WdszVersionName }}</view> -->
        <view v-if="showUpdate">
          <button type="primary" plain="true" size="mini" @tap="handleUpdate">更新</button>
				  <text style="width: 10upx; display: inline-block;"></text>
				  <button type="primary" plain="true" size="mini" @tap="hideButton">收起</button>
        </view>
        <!-- <view>当前版本为V{{ $global.wdszVersionName }}</view>
				<view>更新说明：</view>
        <view class="summary-content">
          <view v-for="(item, index) in utils.updateDescription" :key="index">{{ item }}</view>
        </view> -->

       <view style="margin-top:10px; color:#1989fa;">
          <a v-if="saleChannel==='test'" :href="update.pkgUrl"><text>点击下载辅助APP</text></a>
          <a v-if="saleChannel==='1'" :href="update.pkgUrl1"><text>点击下载辅助APP</text></a>
          <a v-if="saleChannel==='2'" :href="update.pkgUrl2"><text>点击下载辅助APP</text></a>
          <a v-if="saleChannel==='3'" :href="update.pkgUrl3"><text>点击下载辅助APP</text></a>
          <a v-if="saleChannel==='4'" :href="update.pkgUrl4"><text>点击下载辅助APP</text></a>
          <a v-if="saleChannel==='5'" :href="update.pkgUrl5"><text>点击下载辅助APP</text></a>
          <a v-if="saleChannel==='7'" :href="update.pkgUrl7"><text>点击下载辅助APP</text></a>
          <a v-if="saleChannel==='8'" :href="update.pkgUrl8"><text>点击下载辅助APP</text></a>
          <a v-if="saleChannel==='10'" :href="update.pkgUrl10"><text>点击下载辅助APP</text></a>
          <a v-if="saleChannel==='11'" :href="update.pkgUrl11"><text>点击下载辅助APP</text></a>
					<a v-if="saleChannel==='31'" :href="update.pkgUrl31"><text>点击下载辅助APP</text></a>
					<a v-if="saleChannel==='801'" :href="update.pkgUrl801"><text>点击下载辅助APP</text></a>
          <!-- <button type="primary" @tap="downloadImage">下载</button> -->
        </view>

        <view>更新说明：</view>
        <view>
          <view v-for="(version, index) in update.updateDescription" :key="index">
            <view>{{version.title}}</view>
            <view v-for="(item, indexContent) in version.content" :key="indexContent" class="summary-content">{{item}}</view>
          </view>
        </view>
      </view>
  </view>
</template>

<script>
import { getUpdate } from '@/api/game'
import { getChannel } from '@/utils/index'
export default {
  data() {
    return {
      saleChannel: '',
      update: '',
      showUpdate: false
    }
  },
  onLoad() {
    this.saleChannel = getChannel()
    this.handleGetUpdate()
  },

  onPullDownRefresh() {
      console.log('refresh');
      this.showUpdate = true
      setTimeout(function () {
          uni.stopPullDownRefresh();
      }, 1000);
  },

  computed: {
    hasNewVersion() {
      // const newVersion = this.$store.getters.newWdszVersion
      const newVersion = this.utils.version
      const currentVersion = this.$global.wdszVersion
      return newVersion > currentVersion
    }
  },

  methods: {
    handleGetUpdate() {
      getUpdate().then(res => {
        this.update = res
      }).catch(err => {
        console.log(err)
      })
    },

    downloadImage: function () {
			uni.showLoading({
				title:'下载中'
			})
			var self = this
			uni.downloadFile({
				url: this.update.pkgUrl,
				success: (res) => {
					console.log('downloadFile success, res is', res)
					self.imageSrc = res.tempFilePath;
					uni.hideLoading();
				},
				fail: (err) => {
					console.log('downloadFile fail, err is:', err)
				}
			})
    },

    hideButton() {
      this.showUpdate = false
    },

    handleUpdate() {
      // #ifdef APP-PLUS  
      const that = this
			plus.runtime.getProperty(plus.runtime.appid, function() {
          getUpdate().then(data => {
            var wgtUrl = data.test.wgtUrl
            var pkgUrl = data.test.pkgUrl
			      if (data.test.version > that.$global.wdszVersion && wgtUrl && data.test.updateType === 1) { // 热更新
                uni.downloadFile({  
			              url: wgtUrl,  
			              success: (downloadResult) => {  
			                  if (downloadResult.statusCode === 200) {  
			                      plus.runtime.install(downloadResult.tempFilePath, {  
			                          force: true  
			                      }, function() {  
			                          console.log('install success...');  
																uni.showToast({
																	title:"辅助更新成功，即将重启",
																	duration:1000,
																	icon:'none'
																})
																setTimeout(function() {
																  plus.runtime.restart();
																}, 1100)
			                      }, function(e) {  
			                          console.error('install fail...'); 
																 uni.showToast({
																 	title:"辅助更新失败",
																	duration:2000,
																	icon:'none'
																 })
			                      });  
			                  }
			              }  
			          }); 
            }
            if (data.test.version > that.$global.wdszVersion && pkgUrl && data.tesst.updateType === 2 ) { //整包更新
							uni.showModal({ //提醒用户更新  
								title: "更新提示",  
								content: data.test.note,  
								success: (res) => {  
									if (res.confirm) {  
										plus.runtime.openURL(pkgUrl);  
									}  
								}  
							})  
						}
          })
			});  
			// #endif
    }
  }
}
</script>

<style lang="css" scoped>
  .summary-wrap {
    padding: 0 15upx;
  }
  .summary-content {
    color: #969799;
  }
  .highlight {
    color: red;
  }
</style>
