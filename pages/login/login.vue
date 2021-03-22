<template>
	<view class="content-login">
		<!-- <view class="uni-title uni-common-pl"></view> -->
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-left">
					选择平台：
				</view>
				<view class="uni-list-cell-db">
					<picker @change="changePlatform" :disabled="false" range-key="text" :value="platformIndex" :range="platformList">
						<view class="uni-input">{{platformName}}</view>
					</picker>
				</view>
			</view>
		</view>
		
		<view class="input-group">
		    <view class="input-row border">
		        <text class="title">账号：</text>
		        <!-- <m-input class="m-input" type="text" :disabled="false"  clearable focus v-model="userInfo.usernamePlatForm" placeholder="请输入账号"></m-input> -->
						<input-autocomplete
								class="unit-item__input"
								v-model="userInfo.usernamePlatForm"
								placeholder="请输入账号"
								highlightColor="#FF0000"
								:stringList="autocompleteStringList"
								v-on:selectItem="selectItemD"/>
		    </view>
		    <view class="input-row">
		        <text class="title">密码：</text>
		        <m-input type="password" displayable v-model="userInfo.passwordPlatForm" placeholder="请输入密码"></m-input>
		    </view>
		</view>

		<view class="btn-row">
		    <button type="primary" class="primary" @tap="handleCheckUser">登录</button>
		</view>

		<view style="margin-top:10px; color:#1989fa; text-align: center;">
      <a :href="utils.zhushouUrl">
        <text>点击下载登录助手</text>
      </a>
    </view>

		<view>
			<view class="content">
				<view class="sub-title">登录说明:</view>
				<view v-for="(item,index) in loginDescription.description" :key="index" class="item-wrap">{{ item }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import CryptoJS from 'crypto-js'
import save from '@/utils/save'
import loginDescription from './loginDescription.json'
import { encrypt, randomWord } from '@/utils/rsa'
import { getUtils, getServer, getRemoteOptions,checkUser,addUser, loginGame,loginByProxy } from '@/api/game'
import { getValueByIndex, getIndexByValue, parseParams } from '@/utils/index'
import mInput from '../../components/m-input.vue'

export default {
	components:{
		mInput
	},
	data() {
		return {
			loginDescription: loginDescription,
			platformIndex: 0,
			platformName: '',
			account: '',
			password: '',
			current: 0,
			remoteOptions: {},
			platformList: [], // 平台信息
			utils: '',
			autocompleteStringList: [],
			flag: {
			    showServer: false
			},
			userInfo: {
			  usernamePlatForm: '', // 平台的用户名
				passwordPlatForm: '', // 平台的密码
				userId: '',
			  platform: 1, // 这个platform用在像辅助添加用户的时候
			  server: '',
			  loginType: 1 // 官方平台：1，taptap：2
			},
			loginInfo: { // 登录过程中需要的数据
				userId: '',
			},
			serverInfo: { // 服务器列表
        client_ip: '',
        server_list: [],
        last_server_list: []
      }		
		}
	},
	onLoad() {
		this.handleGetRemoteOptions()
		this.handleGetUtils()
	},
	computed: {
		isTapTapUser() {
			return this.userInfo.usernamePlatForm.indexOf('openid') === -1
		},
		isQudaoUser() {
			return this.userInfo.usernamePlatForm.indexOf('qudaoopenid') != -1
		},
		isQQWeixinUser() {
			const isQQ = this.userInfo.usernamePlatForm.indexOf('qqopenid') != -1
			const isWeixin = this.userInfo.usernamePlatForm.indexOf('weixinopenid') != -1
			const res = isQQ || isWeixin
			return res
		}
	},
	methods: {
		//响应选择事件，接收选中的数据
    selectItemD(data) {
				this.userInfo.passwordPlatForm = data.password
    },

		// 获取服务器
		handleGetServer() {
			getServer().then(res => {
				const taptap_mobile = res.taptap_mobile
				const qudao = res.qudao
				this.serverInfo.server_list = taptap_mobile.contact(qudao)
			})
		},


		// 获取远程选项
		handleGetRemoteOptions() {
			getRemoteOptions()
			.then(res => {
				this.remoteOptions = res
				this.platformList = res.platform
				this.loadLoginInfo()
			})
			.catch(err => {
				console.log(err)
			})
		},

		// 获取Utils
		handleGetUtils() {
      getUtils().then(res => {
        this.utils = res
      }).catch(err => {
        console.log(err)
      })
    },

		// 获取签名
		getSign(keyTime) {
			const key = 'askj8789kldksiewkszkm2323lkkl'
			const str = key + keyTime
			const hashStr =  CryptoJS.SHA1(str).toString()
			const sign = hashStr.slice(1,7).toLocaleUpperCase()
			return sign
		},
		

		// 登录辅助
		async handleLogin() {
			const ts = new Date().getTime()
			const keyTime = parseInt(ts/1000)
			let passwordLogin = '123456'
			if (this.userInfo.loginType === 1) {
				passwordLogin = this.userInfo.passwordPlatForm
			}
			const params = {
				nickName: this.userInfo.usernamePlatForm,
				password: passwordLogin,
				quickReg: 'login',
				sign: this.getSign(keyTime),
				keyTime: keyTime
			}
			try {
				// #ifdef APP-PLUS
				const res = await loginGame(params)
				// #endif
				// #ifdef H5
				const uriParams = parseParams(params)
				const loginUrl = `http://login.dgzz1.com:20002/?${uriParams}`
				const paramProxy = {
					url: loginUrl
				}
				const res = await loginByProxy(paramProxy)
				// #endif
				if (res.state === "success") {
					this.saveAccountList(this.userInfo.usernamePlatForm, this.userInfo.passwordPlatForm)
					this.userInfo.userId = res.loginName
					this.getLastServer(res.serverIds)
				} else {
					uni.showToast({
						title: '登录游戏失败',
						duration: 2000,
						icon: 'none'
					})
				}
			} catch(e) {
				console.error(e)
				uni.showToast({
					title: '登录游戏异常',
					duration: 2000,
					icon: 'none'
				})
			}
		},

		// 查找有角色的服务器
		getLastServer(serverIds) {
			getServer().then(res => {
				const taptap_mobile = res.taptap_mobile
				const qudao = res.qudao
				this.serverInfo.server_list = taptap_mobile.concat(qudao)
				this.serverInfo.last_server_list = []
				this.serverInfo.server_list.forEach( oneServer => {
					const oneServerId = parseInt(oneServer.value)
					if (serverIds.includes(oneServerId)) {
						this.serverInfo.last_server_list.push(oneServer)
					}
				})
				this.flag.showServer = true
				this.saveLoginInfo()
				this.handleAddUser()
			}).catch((err) => {
				console.log(err)
				this.$toast("获取服务器失败，请稍后重试")
			})
		},

		// 检查用户
		handleCheckUser() {
			if (this.isTapTapUser && this.userInfo.loginType != 1) {
				this.$toast('TapTap账号请选择TapTap平台登录')
				return
			}
			if (this.isQQWeixinUser && this.userInfo.loginType != 2) {
				this.$toast('微信或者QQ账号提取的用户请选择QQ/微信平台')
				return
			}
			if (this.isQudaoUser && this.userInfo.loginType != 3) {
				this.$toast('其他渠道用户请选择九游/小米/华为/这个平台')
				return
			}
			const params = {
				username: this.userInfo.usernamePlatForm,
				pwd_md5: CryptoJS.MD5(this.userInfo.passwordPlatForm).toString(),
			}
			console.log('checkuser', this.userInfo.loginType)
			checkUser(params).then(res => {
				if(res.code === 200) {
					this.userInfo.userId = res.userId
					this.handleLogin()
				} else if ([401,403].includes(res.code)) {
					if (this.userInfo.loginType == 1 && this.isTapTapUser){
						// 如果TapTap账号用户，不存在或者密码不对则重新登录
						this.handleLogin()
					} else {
						this.$toast('请使用登录助手提取账号密码后登录')
					}
				} else if (res.code === 404) {
					this.$toast('参数异常')
				}
			}).catch(e => {
				console.log(e)
				this.$toast('检查用户异常')
			})
		},


		// 添加用户
		handleAddUser() {
			this.secretKey = randomWord(false, 16)
			const cipherUserId = CryptoJS.AES.encrypt(this.userInfo.userId, CryptoJS.enc.Utf8.parse(this.secretKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
			const cipherUsername = CryptoJS.AES.encrypt(this.userInfo.usernamePlatForm, CryptoJS.enc.Utf8.parse(this.secretKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
      const cipherPwd = CryptoJS.AES.encrypt(this.userInfo.passwordPlatForm, CryptoJS.enc.Utf8.parse(this.secretKey), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
			const params = {
				login_type: this.userInfo.loginType,
				userId: cipherUserId,
				username: cipherUsername,
				password: cipherPwd,
				k: encrypt(this.secretKey) // ase的密钥
			}
			addUser(params).then(res => {
				if (res.code === 200) {
					this.toMain()
				}
			}).catch(err => {
				console.log(err)
				uni.showToast({
					title: '辅助登录异常',
					duration: 2000,
					icon: 'none'
				})
			})
		},


		// 将登录成功的用户名密码添加到autocompleteStringList中
		saveAccountList(username,password) {
			const indexUsername = this.autocompleteStringList.findIndex((item) => {
				return item.text === username
			})
			if (indexUsername === -1) {
				if (this.autocompleteStringList.length >= 5) {
					this.autocompleteStringList.pop()
				}
				const userObj = {
					text: username,
					password: password
				}
				this.autocompleteStringList.unshift(userObj)
			} else {
				this.autocompleteStringList[indexUsername].password = password
			}
		},
		
		// 读取记住的登录信息
    loadLoginInfo() {
      const gameLoginInfo = save.getGameLoginInfo()
      if (gameLoginInfo) {
        this.userInfo.platform = gameLoginInfo.platform
        this.userInfo.server = gameLoginInfo.server
        this.userInfo.usernamePlatForm = gameLoginInfo.usernamePlatForm
        this.userInfo.passwordPlatForm = gameLoginInfo.passwordPlatForm
        this.userInfo.userId = gameLoginInfo.userId
				this.userInfo.loginType = gameLoginInfo.loginType
				this.flag.showServer = gameLoginInfo.showServer
				this.platformName = gameLoginInfo.platformName
				this.serverInfo = gameLoginInfo.serverInfo || {}
				if (Array.isArray(gameLoginInfo.autocompleteStringList)) this.autocompleteStringList = gameLoginInfo.autocompleteStringList
				this.initSaveData()
      }
    },

    // 存储登录信息到LocalStorage
    saveLoginInfo() {
			console.log('save', this.userInfo.loginType)
      const gameLoginInfo = {
        platform: this.userInfo.platform,
        server: '',
        usernamePlatForm: this.userInfo.usernamePlatForm,
        passwordPlatForm: this.userInfo.passwordPlatForm,
        loginType: this.userInfo.loginType,
        userId: this.userInfo.userId,
				showServer: this.flag.showServer,
				platformName: this.platformName,
				serverInfo: this.serverInfo,
				autocompleteStringList: this.autocompleteStringList
			}
      save.setGameLoginInfo(gameLoginInfo)
    },

		// 跳转到主页
		toMain() {
			uni.reLaunch({
        url: '../home/home',
      })
		},
		
		// 选择平台
		changePlatform: function(e) {
			if (e.target.value !== -1) {
				this.platformIndex = e.target.value
			} else {
				this.platformIndex = 0
			}
			this.platformName = this.platformList[this.platformIndex].text
			this.userInfo.loginType = getValueByIndex(this.platformList, this.platformIndex)
		},

		// 加载后将存储的数据显示出来
		initSaveData() {
			this.platformIndex = getIndexByValue(this.platformList, this.userInfo.loginType)
			if (this.platformIndex !== -1) {
				this.platformName = this.platformList[this.platformIndex].text
			}
		}
	}
}
</script>

<style lang="css" scoped>
.flex-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.left {
	width: 70%;
}
.server-wrap {
	margin-top: 20upx;
}
.btn-center {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20upx;
}
.attr-flex {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.attr-flex-item {
	flex: 1;
	width: 33.3%;
	min-width: 33.3%;
	max-width: 33.3%;
}
.radio-flex {
	/* width: 100%; */
	display: flex;
}
.radio-flex-item {
	flex: 1;
	width: 32%;
	min-width: 32%;
	max-width: 32%;
}
.content {
  padding: 10rpx 30rpx;
	user-select: text;
}
.sub-title {
	font-weight: 600;
}
.item-wrap {
  color: #969799;
  padding-bottom: 20rpx;
}
.unit-item__input {
	text-align: left;
	flex:1;
	padding: 0 10upx;
	min-height: 50upx;
	line-height: 50upx;
	z-index: 1;
}
</style>
