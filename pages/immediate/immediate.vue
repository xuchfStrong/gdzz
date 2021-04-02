<template>
  <view class="content">
		<view >
		  <view class="list-cell">
		      <view class="uni-list-cell-left">
		          有角色的服务器：
		      </view>
		      <view class="uni-list-cell-db">
		          <picker @change="changeLastServer" :value="lastServerIndex" class="bg-picker-gongfa" range-key="text" :range="serverInfo.last_server_list">
		              <view class="uni-input">{{serverName}}</view>
		          </picker>
		      </view>
		  </view>
		</view>

    <view>
			<view class="btn-center btn-center-margin">
				<view>
					<button type="primary" plain="true" size="mini" @tap="loginSwitch">切换账号</button>
					<text style="width: 10upx; display: inline-block;"></text>
					<button v-if="!flag.loginFlag" type="primary" size="mini" @tap="initWebSocket">登录游戏</button>
          <button v-else type="warn" size="mini" @tap="handleLogout">退出游戏</button>
				</view>
			</view>
		</view>

    <view>
			<text>辅助版本类型：</text>
			<text>{{ fuzhuStatus.fuzhu_vip | vipStatus }}</text>
		</view>
		<view>
			<text>辅助到期时间：</text>
			<text :class="{danger: fuzhuStatus.isExpired}">{{ fuzhuStatus.end_time }}</text>
		</view>

    <view v-for="(displayInfo, displayIndex) in viewDisplay.gameInfoConfig" :key="displayIndex">
			<view class="uni-divider">
				<view class="uni-divider__content">{{displayInfo.label}}</view>
				<view class="uni-divider__line"></view>
			</view>
			<view class="attr-flex">
				<view v-for="(item) in viewDisplay[displayInfo.key]" :key="item.key" :class="getAttrClass(item.columnSize)">
					<text>{{ item.label }}</text>
					<text>{{ roleInfo[item.key] | valueFormatFilter}}</text>
				</view>
			</view>
		</view>

    <view class="uni-divider">
			<view class="uni-divider__content">挂机设置</view>
			<view class="uni-divider__line"></view>
		</view>

    <uni-segmented-control :current="currentTab" :values="items" @clickItem="onClickItem" styleType="button" activeColor="#007aff"></uni-segmented-control>
    <view class="tab-wrap">
      <view v-show="currentTab === 0">
        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>推图副本挑战</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">已经失败{{ bossAttackTime }}次</text>
            <uni-number-box :value="attackTime.bossTime" :max="200" @change="changeNumberInput($event,'tuituBoss')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.tuituFlag" type="primary" size="mini" @tap="startFubenBoss">开始</button>
            <button v-else type="warn" size="mini" @tap="stopFubenBoss">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>推图副本小怪</text>
          </view>
          <view class="attr-flex-item">
            <uni-number-box :value="attackTime.xiaoguaiTime" :max="5000000" @change="changeNumberInput($event,'xiaoguai')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.xiaoguaiFlag" type="primary" size="mini" @tap="confirmFubenXiaoguai">开始</button>
            <button v-else type="warn" size="mini" @tap="stopFubenXiaoguai">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>无尽炼狱挑战</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">已经失败{{ wujinAttackTime }}次</text>
            <uni-number-box :value="attackTime.wujinTime" :max="200" @change="changeNumberInput($event,'wujin')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.wujinFlag" type="primary" size="mini" @tap="startWujin">开始</button>
            <button v-else type="warn" size="mini" @tap="stopWujin">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>恶魔巢穴挑战</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">剩余美女{{ emeFubenInfo.jgTimes }}次,亡灵{{ emeFubenInfo.wlTimes }}次,恶魔{{ emeFubenInfo.sqTimes }}次</text>
            <uni-number-box :value="attackTime.emeTime" @change="changeNumberInput($event,'emeFuben')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.emeFubenFlag" type="primary" size="mini" @tap="startEme">开始</button>
            <button v-else type="warn" size="mini" @tap="stopEme">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>每日副本挑战</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">{{ meiriFuebnAttackTimes }}</text>
            <uni-number-box :value="attackTime.meiriTime" @change="changeNumberInput($event,'meiriFuben')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.meiriFubenFlag" type="primary" size="mini" @tap="startMeiriFuben">开始</button>
            <button v-else type="warn" size="mini" @tap="stopMeiriFuben">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>竞技场挑战</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">已打{{ jjcInfo.todayAttackTimes }}次,剩余{{ jjcInfo.jjcTime }}次,胜{{ jjcInfo.jjcWinTime }}次,输{{ jjcInfo.jjcLoseTime }}次,连胜{{ jjcInfo.jjcLinkWinTime }}次</text>
            <uni-number-box :value="attackTime.zhanliDiscount" :step="10" @change="changeNumberInput($event,'jjc')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.jjcFlag" type="primary" size="mini" @tap="startJingjichang">开始</button>
            <button v-else type="warn" size="mini" @tap="stopJingjichang">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>远征迷宫</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">剩余{{ yzmgInfo.remainTimes }}次</text>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.yzmgFlag" type="primary" size="mini" @tap="startYZMG">开始</button>
            <button v-else type="warn" size="mini" @tap="stopYZMG">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>血战竞技挑战</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">剩余{{ taskInfo.xuezhanRemainTime }}次</text>
            <uni-number-box :value="attackTime.xuezhanjingjiTime" @change="changeNumberInput($event,'xuezhan')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.xuezhanjingjiFlag" type="primary" size="mini" @tap="startXuezhan">开始</button>
            <button v-else type="warn" size="mini" @tap="stopXuezhan">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>蜡像馆挑战</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">剩余{{ laxiangguanInfo.canAttackTime }}次</text>
            <text class="tips">{{ laxiangguanLevel }}</text>
            <uni-number-box :value="attackTime.laxiangguanTime" @change="changeNumberInput($event,'laxiangguan')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.laxiangguanFlag" type="primary" size="mini" @tap="startLaxiangguan">开始</button>
            <button v-else type="warn" size="mini" @tap="stopLaxiangguan">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>蜡像馆低一级挑战</text>
          </view>
          <view class="attr-flex-item">
            <uni-number-box :value="attackTime.laxiangguanLowTime" @change="changeNumberInput($event,'laxiangguanLow')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.laxiangguanLowFlag" type="primary" size="mini" @tap="startLaxiangguanLow">开始</button>
            <button v-else type="warn" size="mini" @tap="stopLaxiangguanLow">停止</button>
          </view>
        </view>

        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>不朽丰碑挑战</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips"><span>剩余{{ taskInfo.bossCanAttackTime }}次</span></text>
            <uni-number-box :value="attackTime.shijieBossTime" @change="changeNumberInput($event,'shijieBoss')"></uni-number-box>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.shijieBossFlag" type="primary" size="mini" @tap="startShiJieBOSS">开始</button>
            <button v-else type="warn" size="mini" @tap="startShiJieBOSS">停止</button>
          </view>
        </view>
      </view>
      <view v-show="currentTab === 1">
          <view class="attr-flex">
            <view class="attr-flex-item-title">
              <text>金币商店</text>
            </view>
            <view class="attr-flex-item">
              <button type="default" size="mini" @tap="flushShop">{{ shopInfo.jinbiShuaXin }}钻石刷新</button>
            </view>
            <view class="attr-flex-item-button">
              <button type="primary" size="mini" @tap="goldShopBuyAll">全买</button>
            </view>
          </view>

          <view class="attr-flex">
            <view class="attr-flex-item-title">
              <text>酒馆十连抽</text>
            </view>
            <view class="attr-flex-item">
              <uni-number-box :value="attackTime.shilianchouTime" @change="changeNumberInput($event,'jiuguan')"></uni-number-box>
            </view>
            <view class="attr-flex-item-button">
              <button type="primary" size="mini" @tap="startShilianchou">开始</button>
            </view>
          </view>

          <view class="attr-flex">
            <view class="attr-flex-item-title">
              <text>恶魔巢穴</text>
            </view>
            <view class="attr-flex-item">
              <text class="tips"><span>已买美女{{ emeFubenInfo.buyjgTimes }}次,亡灵{{ emeFubenInfo.buywlTimes }}次,恶魔{{ emeFubenInfo.buysqTimes }}次</span></text>
              <picker @change="changePicker($event, 'emeFubenList')" :value="pickerIndex.emeFubenList" class="bg-picker-gongfa"  range-key="text" :range="options.emeFubenList">
                <view class="uni-input picker-text">{{options.emeFubenList[pickerIndex['emeFubenList']].text}}</view>
              </picker>
            </view>
            <view class="attr-flex-item-button">
              <button type="primary" size="mini" @tap="buyEme(pickerIndex.emeFubenList)">购买</button>
            </view>
          </view>

          <view class="attr-flex">
            <view class="attr-flex-item-title">
              <text>每日副本</text>
            </view>
            <view class="attr-flex-item">
              <text class="tips"><span>{{meiriFubenBuyTimes}}</span></text>
              <picker @change="changePicker($event, 'meiriFubenList')" :value="pickerIndex.meiriFubenList" class="bg-picker-gongfa"  range-key="text" :range="options.meiriFubenList">
                <view class="uni-input picker-text">{{options.meiriFubenList[pickerIndex['meiriFubenList']].text}}</view>
              </picker>
            </view>
            <view class="attr-flex-item-button">
              <button type="primary" size="mini" @tap="buyMeiriFuben(pickerIndex.meiriFubenList)">购买</button>
            </view>
          </view>

          <view class="attr-flex">
            <view class="attr-flex-item-title">
              <text>蜡像馆购买</text>
            </view>
            <view class="attr-flex-item">
              <text class="tips"><span>已买{{ laxiangguanInfo.buyTime }}次</span></text>
              <uni-number-box :value="attackTime.laxiangguanBuyTime" @change="changeNumberInput($event,'buyLaxiangguan')"></uni-number-box>
            </view>
            <view class="attr-flex-item-button">
              <button type="primary" size="mini" @tap="buyLaxiangguan">购买</button>
            </view>
          </view>
      </view>
      <view v-show="currentTab === 2">
        <view class="attr-flex">
          <view class="attr-flex-item-title">
            <text>每日副本扫荡</text>
          </view>
          <view class="attr-flex-item">
          </view>
          <view class="attr-flex-item-button">
            <button type="primary" size="mini" @tap="saodangMeiriFuben">扫荡</button>
          </view>
        </view>

        <view class="attr-flex item-space">
          <view class="attr-flex-item-title">
            <text>无尽炼狱扫荡</text>
          </view>
          <view class="attr-flex-item">
          </view>
          <view class="attr-flex-item-button">
            <button type="primary" size="mini" @tap="saodangWujin">扫荡</button>
          </view>
        </view>

        <view class="attr-flex item-space">
          <view class="attr-flex-item-title">
            <text>恶魔巢穴扫荡</text>
          </view>
          <view class="attr-flex-item">
          </view>
          <view class="attr-flex-item-button">
            <button type="primary" size="mini" @tap="saodangEme">扫荡</button>
          </view>
        </view>

        <view class="attr-flex item-space">
          <view class="attr-flex-item-title">
            <text>蜡像馆扫荡</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">扫荡后自动领任务奖</text>
          </view>
          <view class="attr-flex-item-button">
            <button type="primary" size="mini" @tap="saodangLaxiangguan">扫荡</button>
          </view>
        </view>

        <view class="attr-flex item-space">
          <view class="attr-flex-item-title">
            <text>装备升级</text>
          </view>
          <view class="attr-flex-item">
            <text class="tips">装备自动升级，用于做成就</text>
          </view>
          <view class="attr-flex-item-button">
            <button v-if="!flag.zbUpdateFlag" type="primary" size="mini" @tap="startZbUpdate">开始</button>
            <button v-else type="warn" size="mini" @tap="stopZbUpdate">停止</button>
          </view>
        </view>
      </view>
      <view v-show="currentTab === 3">
          <Taozhuang/>
      </view>
    </view>

    <view class="uni-divider">
			<view class="uni-divider__content attr-flex-item">
        <button type="default" size="mini" @tap="clearLog">清理日志</button>
      </view>
			<view class="uni-divider__line"></view>
		</view>

    <view>
		  <scroll-view :scroll-top="scrollTop" show-scrollbar="false" scroll-y="true" class="scroll-Y">
		    <text>{{guajiLog}}</text>
		  </scroll-view>
		</view>
  </view>
</template>

<script>
import CryptoJS from 'crypto-js'
import save from '@/utils/save'
import moment from 'moment'
import viewDisplay from './viewDisplay.json'
import { checkFuzhuStatus } from '@/utils/projectFun'
import { getValueByIndex, getIndexByValue, toast} from '@/utils/index'
import mInput from '../../components/m-input.vue'
import Taozhuang from './components/Taozhuang.vue'
import { mapState, mapActions } from 'vuex'
import { serverTime } from '@/api/game'
import { wujin, boss, meiriFuben, emeFuben, guaji, hadBuyInfo } from './response-parse'
import { xuezhan, shijieboss, laxiangguanTaskReward, laxiangguan, shilianchou } from './response-parse'
import { calcZhanli, calcJjcInfo, calcZhuangbei, yzmgAddWeight, yzmgCalcPos, yzmgCalcParams, yzmgUpdateLineMaps } from './response-parse'

export default {
  components:{
		mInput,
    Taozhuang
	},
  filters: {
    vipStatus(isVip) {
      const map = {
        0: '普通版',
        1: 'VIP版'
      }
      return map[isVip]
    },
    // 单位换算
    valueFormatFilter(str) {
			if (isNaN(str)) return str
      const numVal = Number(str)
			if (isNaN(numVal)) return ''
			if (numVal < 0) return '未获取到'
      if (numVal > 100000000) {
        return (numVal / 100000000).toFixed(1) + '亿'
      } else if (numVal > 1000000) {
        return (numVal / 10000).toFixed(1) + '万'
      } else {
				return str
			}
    }
  },
  data() {
    return {
      lastServerIndex: 0,
		  allServerindex: 0,
      platformName: '',
			serverName: '',
      timeDiff: 0,
      socketTask: null,
      bossAttackTime: -1,
      wujinAttackTime: -1,
      pIn: 0,
      keyCode: 'askj8789kldksiewkszkm2323lkkl',
      viewDisplay: {},
      options: {},
      scrollTop: 999,
      currentTab: 0,
      fuzhuStatus: {},
      items: ['挑战','购买','日常','套装'],
			old: {
			    scrollTop: 0
			},
      roleInfo: {
        name: '',
        levelId: 0,
        wujinLevelId: 0,
        level: '', // 等级
        zuanshi: '',
        xuejing: '',
        jinbi: '',
        wujingbi: '',
        shenqisuipian: '',
        ronglian: '',
        yuanzhengbi: '',
        taozhuangsuipian: '',
        rongyu: '', // 竞技荣誉
        jiban: '',
        laxiangbi: '', // 蜡像币
        zhanli: 0, // 战力
        roleId: '',
        zhuangbeiList: [] // 计算后的，装备列表，用于升级
      },
      userInfo: {
			  usernamePlatForm: '', // 平台的用户名
				passwordPlatForm: '', // 平台的密码
        userId: '',
        password: '', // 登录游戏服务器的密码，websocket连接使用
			  platform: '', // 这个platform用在像辅助添加用户的时候
			  server: '',
        wsUrl: '',
			  loginType: 1 // 官方平台：1，taptap：2
			},
      serverInfo: { // 服务器列表
        last_server_list: []
			},
      laxiangguanInfo: { // 蜡像馆信息
        difficulty: 0,
        level: 0,
        buyTime: 0,
        canAttackTime: 0
      },
      emeFubenInfo: { // 恶魔巢穴信息
        buyjgTimes: 0, // 美女副本购买次数
        jgLevel: 0, // 美女副本级别
        jgTimes: 0, // 美女副本可打次数
        buywlTimes: 0, // 亡灵副本购买次数
        wlLevel: 0, // 亡灵副本级别
        wlTimes: 0, // 亡灵副本可打次数
        buysqTimes: 0, // 恶魔副本购买次数
        sqLevel: 0, // 恶魔副本级别
        sqTimes: 0 // 恶魔副本可打次数
      },
      jjcInfo: {
        jjcTime: 0, // 竞技场剩余次数
        jjcWinTime: 0, // 竞技场胜利次数
        jjcLoseTime: 0, // 竞技场输的次数
        jjcLinkWinTime: 0, // 连胜次数
        todayAttackTimes: 0, // 今天攻击次数
        winIds: [], // 当前返回的列表中已经打赢的角色
        roleList: [], // 竞技场角色信息
        canAttackRole: [] // 可以攻击的角色
      },
      yzmgInfo: { // 远征迷宫信息
        zhenrong: [], // 可以布阵的英雄
        remainTimes: 0, // 剩余次数
        shouldStop: false, // 因为死亡英雄过多，不能开始
        moheZhandou: false, // 魔盒是否遭遇战斗
        lineMaps: [], // 线路图
        pos: 0, // 选择的目标位置
        packetParams: { evtId: 0, param: 9 } // 这里设置为9只是为了和实际值不同
      },
      meiriFubenInfo: {
        buyjinbiTimes: 0, // 金币副本购买次数
        jinbiLevel: 0, // 金币副本级别
        jinbiTimes: 0, // 金币副本可打次数
        buyexpTimes: 0, // 经验副本购买次数
        expLevel: 0, // 经验副本级别
        expTimes: 0, // 经验副本可打次数
        buyjibanTimes: 0, // 羁绊副本购买次数
        jibanLevel: 0, // 羁绊副本级别
        jibanTimes: 0, // 羁绊副本可打次数
        buyronglianTimes: 0, // 熔炼副本购买次数
        ronglianLevel: 0, // 熔炼副本级别
        ronglianTimes: 0, // 熔炼副本可打次数
        buyyaocaiTimes: 0, // 药草副本购买次数
        yaocaiLevel: 0, // 药草副本级别
        yaocaiTimes: 0, // 药草副本可打次数
        buyxuejingshiTimes: 0, // 血精副本购买次数
        xuejingshiLevel: 0, // 血精副本级别
        xuejingshiTimes: 0 // 血精副本可打次数
      },
      shopInfo: { // 夏洛克商店信息
        jinbiShuaXin: 0, // 金币商店刷新价格
        hadBuyJinbi: false, // 金币商店是否已经买了
        allInfo: null,
        wujingShop: [], // 无尽商店
        jingjiShop: [], // 竞技商店
        taozhuangShop: [], // 套装商店
        yuanzhengShop: [], // 远征商店
        emeFuben: [
          { 'text': '美女副本-经验书', 'value': 1 },
          { 'text': '亡灵副本-套装碎片', 'value': 2 },
          { 'text': '恶魔副本-神器碎片', 'value': 3 }
        ],
        meiriFuben: [
          { 'text': '金币副本', 'value': 1 },
          { 'text': '经验副本', 'value': 2 },
          { 'text': '羁绊副本', 'value': 3 },
          { 'text': '熔炼副本', 'value': 4 },
          { 'text': '药材副本', 'value': 5 },
          { 'text': '血精副本', 'value': 6 }
        ]
      },
      taskInfo: { // 每天的各种任务信息
        xuezhanRemainTime: 0, // 血战竞技剩余次数
        bossAttackTime: 0, // 不朽丰碑攻击次数
        bossCanAttackTime: 0 // 不朽丰碑剩余次数
      },
      buyInfo: {
        laxiangguanBuyTime: 1, // 蜡像馆的购买次数
        wujingId: 0, // 购买无尽商店的物品ID
        jingjiId: 0, // 购买竞技商店的物品ID
        taozhuangId: 0, // 购买套装商店的物品ID
        yuanzhengId: 0, // 购买远征商店的物品ID
        emeFubenType: 1, // 恶魔巢穴副本类型
        meiriFubenType: 1 // 每日副本类型
      },
      flag: {
        showServer: false,
        loginFlag: false,
        logoutFlag: false,
        tuituFlag: false,
        xiaoguaiFlag: false,
        wujinFlag: false,
        emeFubenFlag: false,
        meiriFubenFlag: false,
        xuezhanjingjiFlag: false,
        laxiangguanFlag: false,
        laxiangguanLowFlag: false,
        shijieBossFlag: false,
        shilianchouFlag: false,
        printJinbiShopLog: true,
        jinbiShopFlag: false,
        jjcFlag: false,
        zbUpdateFlag: false,
        yzmgFlag: false
      },
      attackTime: {
        bossTime: 1,
        xiaoguaiTime: 1,
        wujinTime: 1,
        emeTime: 1,
        meiriTime: 1,
        xuezhanjingjiTime: 1,
        laxiangguanTime: 1,
        laxiangguanLowTime: 1,
        shijieBossTime: 1,
        shilianchouTime: 1,
        zhanliDiscount: 30
      },
      timer: {
        heartBeatTimer: null,
        bossTimer: null,
        xiaoguaiTimer: null,
        wujinTimer: null,
        emeTimer: null,
        meiriTimer: null,
        buyJinbiShopTimerYaocao: null,
        buyJinbiShopTimerHero: null,
        xuezhanjingjiTimer: null,
        guajiXiaoguaiTimer: null,
        laxiangguanTimer: null,
        laxiangguanLowTimer: null,
        laxiangguanBuyTimer: null,
        shijieBossTimer: null,
        shilianchouTimer: null,
        jjcTimer: null,
        zbUpdateTimer: null,
        yzmgTimer: null
      },
      switchFlag: {
        autoGlodShop: false
      },
      pickerIndex: {
        emeFubenList: 0,
        meiriFubenList: 0
      },
      logs: []
    }
  },
  computed: {
    ...mapState([
      'fuzhuStatusGlobal'
    ]),
    guajiLog() {
      return this.$store.state.guajiLog.join()
    },
    isPassedTwoHours() {
      const a = moment(new Date())
      const b = moment(this.roleInfo.update_time)
      const duration = a.diff(b)
      return duration > 2 * 3600 * 1000
    },
    levelIdStr() {
      const mo = parseInt((this.roleInfo.levelId - 1) / 200) + 1
      const yu = (this.roleInfo.levelId - 1) % 200 + 1
      const str = mo + '-' + yu
      return str
    },
    attackWujinLevelId() {
      return this.roleInfo.wujinLevelId + 1
    },
    jinbiFormat() {
      if (this.roleInfo.jinbi) {
        const jinbi = this.roleInfo.jinbi
        return (jinbi / 100000000).toFixed(2) + '亿'
      } else {
        return ''
      }
    },
    // 蜡像馆难度
    laxiangguanLevel() {
      const difficultyMap = { 1: '初级', 2: '中级', 3: '高级' }
      if (this.laxiangguanInfo.difficulty) {
        return difficultyMap[this.laxiangguanInfo.difficulty] + '难度' + this.laxiangguanInfo.level
      } else {
        return ''
      }
    },
    // 每日副本购买次数
    meiriFubenBuyTimes() {
      const dayNum = parseInt(moment().format('d'))
      const fubenType = { 1: '金币', 2: '经验', 3: '羁绊', 4: '熔炼', 5: '药材', 6: '血精' }
      let res = ''
      if (dayNum === 0) {
        res = '已买金币' + this.meiriFubenInfo.buyjinbiTimes + '次,' +
                    '经验' + this.meiriFubenInfo.buyexpTimes + '次,' +
                    '羁绊' + this.meiriFubenInfo.buyjibanTimes + '次,' +
                    '熔炼' + this.meiriFubenInfo.buyronglianTimes + '次,' +
                    '药草' + this.meiriFubenInfo.buyyaocaiTimes + '次,' +
                    '血精' + this.meiriFubenInfo.buyxuejingshiTimes + '次'
      } else {
        switch (dayNum) {
          case 1:
            res = '已买' + fubenType[dayNum] + this.meiriFubenInfo.buyjinbiTimes + '次'
            break
          case 2:
            res = '已买' + fubenType[dayNum] + this.meiriFubenInfo.buyexpTimes + '次'
            break
          case 3:
            res = '已买' + fubenType[dayNum] + this.meiriFubenInfo.buyjibanTimes + '次'
            break
          case 4:
            res = '已买' + fubenType[dayNum] + this.meiriFubenInfo.buyronglianTimes + '次'
            break
          case 5:
            res = '已买' + fubenType[dayNum] + this.meiriFubenInfo.buyyaocaiTimes + '次'
            break
          case 6:
            res = '已买' + fubenType[dayNum] + this.meiriFubenInfo.buyxuejingshiTimes + '次'
            break
        }
      }
      return res
    },
    // 每日副本挑战次数
    meiriFuebnAttackTimes() {
      const dayNum = parseInt(moment().format('d'))
      const fubenType = { 1: '金币', 2: '经验', 3: '羁绊', 4: '熔炼', 5: '药材', 6: '血精' }
      let res = ''
      if (dayNum === 0) {
        res = '剩余金币' + this.meiriFubenInfo.jinbiTimes + '次,' +
                    '经验' + this.meiriFubenInfo.expTimes + '次,' +
                    '羁绊' + this.meiriFubenInfo.jibanTimes + '次,' +
                    '熔炼' + this.meiriFubenInfo.ronglianTimes + '次,' +
                    '药草' + this.meiriFubenInfo.yaocaiTimes + '次,' +
                    '血精' + this.meiriFubenInfo.xuejingshiTimes + '次'
      } else {
        switch (dayNum) {
          case 1:
            res = '剩余' + fubenType[dayNum] + this.meiriFubenInfo.jinbiTimes + '次'
            break
          case 2:
            res = '剩余' + fubenType[dayNum] + this.meiriFubenInfo.expTimes + '次'
            break
          case 3:
            res = '剩余' + fubenType[dayNum] + this.meiriFubenInfo.jibanTimes + '次'
            break
          case 4:
            res = '剩余' + fubenType[dayNum] + this.meiriFubenInfo.ronglianTimes + '次'
            break
          case 5:
            res = '剩余' + fubenType[dayNum] + this.meiriFubenInfo.yaocaiTimes + '次'
            break
          case 6:
            res = '剩余' + fubenType[dayNum] + this.meiriFubenInfo.xuejingshiTimes + '次'
            break
        }
      }
      return res
    }
  },
  watch: {
    logs(newVal) {
      this.changeGuajiLog(newVal)
      // this.scrollToBottom()
    },
  },
  onLoad() {
    this.roleInfo = Object.assign({}, viewDisplay.roleInfoDefault)
    this.options = viewDisplay.options
    this.viewDisplay = viewDisplay
    this.getServerTime()
    this.loadLoginInfo()
    this.handleCheckStatus()
  },
  methods: {
    ...mapActions([
      'changeGuajiLog'
    ]),

    scrollToBottom() {
			const self = this
			setTimeout(function() { self.scrollTop = self.scrollTop + 10 }, 0)
		},

    loginSwitch() {
			uni.navigateTo({
			    url: '../login/login'
			})
		},

    calcLevelIdStr(levelId) {
      const mo = parseInt((levelId - 1) / 200) + 1
      const yu = (levelId - 1) % 200 + 1
      const str = mo + '-' + yu
      return str
    },

    getAttrClass(columnSize) {
			if (columnSize === 1) {
				return 'attr-flex-item-1'
			} else if (columnSize === 2) {
				return 'attr-flex-item-2'
			} else {
				return 'attr-flex-item-3'
			}
		},

    handleCheckStatus() {
      checkFuzhuStatus().then(res => {
        this.fuzhuStatus = res
      })
    },

    // 读取记住的登录信息
		loadLoginInfo() {
			uni.setNavigationBarTitle({
					title: '古代战争火箭辅助V' + this.$global.fuzhuVersionName
			});
			const gameLoginInfo = save.getGameLoginInfo()
			if (gameLoginInfo.serverInfo) {
				this.userInfo.platform = gameLoginInfo.platform
				this.userInfo.server = gameLoginInfo.server
				this.userInfo.usernamePlatForm = gameLoginInfo.usernamePlatForm
				this.userInfo.passwordPlatForm = gameLoginInfo.passwordPlatForm
				this.userInfo.username = gameLoginInfo.username
				this.userInfo.loginType = gameLoginInfo.loginType
				this.userInfo.userId = gameLoginInfo.userId
				this.platformName = gameLoginInfo.platformName
				this.flag.showServer = gameLoginInfo.showServer
				this.serverInfo = gameLoginInfo.serverInfo
        this.initSaveData()
			}
		},

    // 加载后将存储的数据显示出来
		initSaveData() {
			const lastServerIndex = getIndexByValue(this.serverInfo.last_server_list, this.userInfo.server)
			if (lastServerIndex !== -1) {
				this.serverName = this.serverInfo.last_server_list[lastServerIndex].text
				this.lastServerIndex = lastServerIndex
        this.userInfo.wsUrl = this.serverInfo.last_server_list[this.lastServerIndex].server_url
			} else {
				this.serverName = ''
			}
		},

    onClickItem(e) {
      this.currentTab = e.currentIndex
    },

    changeNumberInput(event, name) {
      // console.log(event, name)
      const value = parseInt(event)
      switch (name) {
        case 'xuezhan':
          this.attackTime.xuezhanjingjiTime = value
          break
        case 'tuituBoss':
          this.attackTime.bossTime = value
          break
        case 'xiaoguai':
          this.attackTime.xiaoguaiTime = value
          break
        case 'wujin':
          this.attackTime.wujinTime = value
          break
        case 'emeFuben':
          this.attackTime.emeTime = value
          break
        case 'meiriFuben':
          this.attackTime.meiriTime = value
          break
        case 'jjc':
          this.attackTime.zhanliDiscount = value
          break
        case 'laxiangguan':
          this.attackTime.laxiangguanTime = value
          break
        case 'laxiangguanLow':
          this.attackTime.laxiangguanLowTime = value
          break
        case 'shijieBoss':
          this.attackTime.shijieBossTime = value
          break
        case 'jiuguan':
          this.attackTime.shilianchouTime = value
          break
        case 'buyLaxiangguan':
          this.attackTime.laxiangguanBuyTime = value
          break
      }
    },

    changePicker(e, pickerKey) {
      const index = e.target.value
			this.pickerIndex[pickerKey] = index
    },

    // 获取服务器时间用于校对
    getServerTime() {
      serverTime().then(res => {
        serverTime = res.data.serverTime
        const localTime = new Date().getTime()
        this.timeDiff = serverTime - localTime
      })
    },

    // 选择登录服务器
		changeLastServer: function(e) {
			this.lastServerIndex = e.target.value
			this.serverName = this.serverInfo.last_server_list[this.lastServerIndex].text
			this.userInfo.server = getValueByIndex(this.serverInfo.last_server_list, e.target.value)
      this.userInfo.wsUrl = this.serverInfo.last_server_list[this.lastServerIndex].server_url
		},

    // 记录日志
    recordLogs(log) {
      // const d = new Date().toLocaleString()
      const d = moment().format('YYYY-MM-DD HH:mm:ss')
      if (this.logs.length > 1000) {
        this.logs.shift()
      }
      const logstr = d + ':' + log + '\n'
      this.logs.splice(0,0,logstr)
      // this.logs.push('\n' + d + ':' + log)
    },

    // 清理日志
    clearLog() {
      this.logs = []
    },

    // 初始化websocket
    initWebSocket() {
      if (!this.userInfo.wsUrl) {
        toast('请选择服务器')
        return
      }
      console.log(this.fuzhuStatusGlobal.isExpired  === "undefined" )
      if (this.fuzhuStatus.isExpired || Object.keys(this.fuzhuStatus).length == 0) {
        toast('辅助已经过期无法登录')
        return
      }
      this.socketTask = uni.connectSocket({
				url: this.userInfo.wsUrl,
				success: ()=> {
					console.log('WebSocket连接成功！')
				}
			})
			this.socketTask.onOpen(() => {
				this.websocketOnOpen()
			})
			this.socketTask.onMessage((res) => {
				this.websocketonmessage(res.data)
			})
			this.socketTask.onClose((e) => {
				console.log('WebSocket被关闭！')
        if (!this.flag.logoutFlag) {
          this.recordLogs('掉线或者被挤下线')
        }
        this.handleLogout()
        console.log('connection closed (' + e + ')')
        })
			this.socketTask.onError(() => {
				console.log('WebSocket连接错误！')
        this.recordLogs('连接发生错误')
			})
    },

    websocketOnOpen() {
      this.recordLogs('登录成功')
      toast('登录成功')
      this.flag.loginFlag = true
      this.login(this.userInfo.userId, this.userInfo.password)
    },

    websocketsend( data) {
      const str = JSON.stringify(data)
			this.socketTask.send({
				data: str,
				success:()=> {
					// console.log('消息发送成功')
				},
				fail:()=> {
					console.log('消息发送失败')
				}
			})
		},

    websocketonmessage(data) {
      const redata = JSON.parse(data)
      // console.log('response', redata)
      if (redata.pd === 1000) {
        this.roleInfo.name = redata.roleName
      }
      if (redata.pd === 1001) {
        this.roleInfo.levelId = redata.k
        this.roleInfo.levelIdStr = this.calcLevelIdStr(redata.k)
        this.roleInfo.level = redata.h
        this.roleInfo.zuanshi = redata.f
        this.roleInfo.xuejing = redata.xuejing
        this.roleInfo.jinbi = redata.g
        this.roleInfo.wujingbi = redata.wujingbi
        this.roleInfo.shenqisuipian = redata.shenqiSuiPian
        this.roleInfo.ronglian = redata.ronglian
        this.roleInfo.yuanzhengbi = redata.yuanzhengBi
        this.roleInfo.taozhuangsuipian = redata.tzSuiPian
        this.roleInfo.rongyu = redata.rongyu
        this.roleInfo.jiban = redata.jiban
        this.roleInfo.laxiangbi = redata.o
        this.roleInfo.roleId = redata.b
        this.jjcInfo.jjcTime = redata.jjcTime
        // this.recordLogs('当前经验：' + redata.i)
      }

      if (redata.pd === 1006) { // 服务器返回的keyCode和serverTime
        this.keyCode = redata.b
        const localTime = new Date().getTime()
        this.timeDiff = redata.a - localTime
      }

      if (redata.pd === 1007) { // 装备列表
        const res = calcZhuangbei(redata, this.roleInfo.level)
        this.roleInfo.zhuangbeiList = res
      }

      if (redata.pd === 1008) {
        this.roleInfo.levelId = redata.openLevel
        this.bossAttackTime = redata.attackTime
      }

      if (redata.pd === 1012) { // 计算竞技场的角色信息
        const res = calcJjcInfo(redata)
        this.jjcInfo.jjcWinTime = res.jjcWinTime
        this.jjcInfo.jjcLoseTime = res.jjcLoseTime
        this.jjcInfo.jjcLinkWinTime = res.jjcLinkWinTime
        this.jjcInfo.todayAttackTimes = res.todayAttackTimes
        this.jjcInfo.winIds = res.winIds
        this.jjcInfo.roleList = res.roleList
      }

      /**
       * 远征迷宫解析
       * 根据lineMaps数组中的元素数量进行区别。
       * 如果只有一个元素，则用于解析下一次攻击的参数，其中根据"h":0和"c":false这两个来判断
       * 这表示是需要进行解析的，"a":14和lineMaps中的元素中的"a":14应该是一样的。
       *
       * 如果有两个元素，那这个数据包中包含了上次攻击目标的行和更新的行，需要把更新的行数据添加到this.yzmgInfo.lineMaps
       * 区别在于其中的一个"c":false另外一个"c":true，需要把"c":false的添加到this.yzmgInfo.lineMaps
       *
       * 如果有三个元素，那说明是刚开始。这个时候第一行只能选中间三个，需要按照刚开始的算法进行解析。
       * 要将yzmgCalcPos(lineMaps, firstTime, pos)中的firstTime设置为1
       *
       * 如果大于三个元素，那说明是之前打了一部分，这个时候需要取倒数三个元素用于计算线路图
       * 这里需要分两种情况：
       * 1. 倒数第三个元素中的"b":0,表示之前没有选择具体的对象，有三个目标可选，
       * 这个时候就需要获取倒数第4个元素中的"b"的值作为上次攻击目标的pos值计算这次应该选择的目标。
       * 2. 如果倒数第三个元素中的"b"有值，那这个值就是本次需要选择的目标位置
       */

      if (redata.pd === 1106) { // 远征迷宫路线信息
        this.yzmgInfo.remainTimes = redata.c
        const length = redata.lineMaps.length
        const copyData = JSON.parse(JSON.stringify(redata))
        // console.log(copyData)
        if (length > 3) {
          const beforeId = copyData.lineMaps[length - 4].b // 倒数第4个evtList就是上次打的那一行
          const cutNum = length - 3
          redata.lineMaps.splice(0, cutNum)
          this.yzmgInfo.lineMaps = yzmgAddWeight(redata)
          if (this.yzmgInfo.lineMaps[0].b) { // 上次已经选择了目标，但是还没打完就退出了
            const line = this.yzmgInfo.lineMaps[0]
            this.yzmgInfo.pos = line.b
            this.yzmgInfo.packetParams.evtId = line.evtList[line.b - 1].a
          } else { // 上次已经打完了，然后没有选择目标就退出了，所有三个目标可以选择，根据上次打的ID进行目标选择
            const res = yzmgCalcPos(this.yzmgInfo.lineMaps, 0, beforeId)
            this.yzmgInfo.pos = res.pos
            this.yzmgInfo.packetParams.evtId = res.evtId
          }
        } else if (length === 3) {
          this.yzmgInfo.lineMaps = yzmgAddWeight(redata)
          const res = yzmgCalcPos(this.yzmgInfo.lineMaps, 1, 3) // 开始打的时候默认是中间，所以可以认为上次打的是中间的一个
          this.yzmgInfo.pos = res.pos
          this.yzmgInfo.packetParams.evtId = res.evtId
        } else if (length === 2) {
          const updateLineData = yzmgAddWeight(redata)
          const copyLineMaps = deepClone(this.yzmgInfo.lineMaps)
          this.yzmgInfo.lineMaps = yzmgUpdateLineMaps(copyLineMaps, updateLineData)
          const pos = this.yzmgInfo.pos
          const res = yzmgCalcPos(this.yzmgInfo.lineMaps, 0, pos)
          this.yzmgInfo.pos = res.pos
          this.yzmgInfo.packetParams.evtId = res.evtId
        } else if (length === 1) {
          const res = yzmgCalcParams(redata)
          this.yzmgInfo.packetParams.evtId = res.evtId
          this.yzmgInfo.packetParams.param = res.param
        }
      }

      if (redata.pd === 1107) { // 远征迷宫阵容信息
        this.yzmgInfo.zhenrong = redata.a
        const heroNum = redata.a.length
        const xueliang = redata.d
        let deadNum = 0
        let aliveNum = 0
        xueliang.forEach(i => {
          if (i) {
            aliveNum += 1
          } else {
            deadNum += 1
          }
        })
        const deadMoreThanHeroNum = deadNum >= heroNum
        const deadMoreThanSix = deadNum >= 6
        if (deadMoreThanHeroNum || deadMoreThanSix) {
          this.yzmgInfo.shouldStop = true
        }
        if ((aliveNum === 0 || deadMoreThanHeroNum || deadMoreThanSix) && this.flag.yzmgFlag) {
          this.recordLogs('英雄阵亡过多，请登录游戏处理,阵亡英雄数量为：' + deadNum)
          this.stopYZMG()
        }
      }

      if (redata.pd === 1023) { // 不朽丰碑攻击次数
        this.taskInfo.bossAttackTime = redata.todayAttackTimes
        this.taskInfo.bossCanAttackTime = 3 - redata.todayAttackTimes
      }

      if (redata.pd === 1025) { // 上阵英雄战力
        this.roleInfo.zhanli = calcZhanli(redata)
      }

      // 商店信息
      if (redata.pd === 1052) {
        this.shopInfo.allInfo = redata
        this.shopInfo.jinbiShuaXin = redata.jinbiShuaXin
        this.shopInfo.hadBuyJinbi = hadBuyInfo(redata).hadBuyJinbi
      }

      if (redata.pd === 1068) { // 冒险小队信息
        this.calcZhanliFromXiaodui(redata)
      }

      // 每日副本信息
      if (redata.pd === 1079) {
        this.meiriFubenInfo.buyjinbiTimes = redata.buyjinbiTimes
        this.meiriFubenInfo.jinbiLevel = redata.jinbiLevel
        this.meiriFubenInfo.jinbiTimes = redata.jinbiTimes
        this.meiriFubenInfo.buyexpTimes = redata.buyexpTimes
        this.meiriFubenInfo.expLevel = redata.expLevel
        this.meiriFubenInfo.expTimes = redata.expTimes
        this.meiriFubenInfo.buyjibanTimes = redata.buyjibanTimes
        this.meiriFubenInfo.jibanLevel = redata.jibanLevel
        this.meiriFubenInfo.jibanTimes = redata.jibanTimes
        this.meiriFubenInfo.buyronglianTimes = redata.buyzuanshiTimes
        this.meiriFubenInfo.ronglianLevel = redata.zuanshiLevel
        this.meiriFubenInfo.ronglianTimes = redata.zuanshiTimes
        this.meiriFubenInfo.buyyaocaiTimes = redata.buyyaocaiTimes
        this.meiriFubenInfo.yaocaiLevel = redata.yaocaiLevel
        this.meiriFubenInfo.yaocaiTimes = redata.yaocaiTimes
        this.meiriFubenInfo.buyxuejingshiTimes = redata.buyxuejingshiTimes
        this.meiriFubenInfo.xuejingshiLevel = redata.xuejingshiLevel
        this.meiriFubenInfo.xuejingshiTimes = redata.xuejingshiTimes
      }

      // 无尽炼狱信息
      if (redata.pd === 1080) {
        this.roleInfo.wujinLevelId = redata.level
        this.wujinAttackTime = redata.attackTime
      }

      // 恶魔巢穴信息
      if (redata.pd === 1088) {
        this.emeFubenInfo.buyjgTimes = redata.buyjgTimes
        this.emeFubenInfo.jgLevel = redata.jgLevel
        this.emeFubenInfo.jgTimes = redata.jgTimes
        this.emeFubenInfo.buywlTimes = redata.buywlTimes
        this.emeFubenInfo.wlLevel = redata.wlLevel
        this.emeFubenInfo.wlTimes = redata.wlTimes
        this.emeFubenInfo.buysqTimes = redata.buysqTimes
        this.emeFubenInfo.sqLevel = redata.sqLevel
        this.emeFubenInfo.sqTimes = redata.sqTimes
      }

      // 蜡像馆信息
      if (redata.pd === 1093) {
        if (redata.difficulty < 4) {
          this.laxiangguanInfo.difficulty = redata.difficulty
          this.laxiangguanInfo.level = redata.level
        } else {
          this.laxiangguanInfo.difficulty = parseInt(redata.difficulty) - 1
          this.laxiangguanInfo.level = 6
        }
        this.laxiangguanInfo.buyTime = redata.buyTime
        this.laxiangguanInfo.canAttackTime = redata.canAttackTime
      }

      // 血战竞技信息
      if (redata.pd === 1100) {
        this.taskInfo.xuezhanRemainTime = redata.battleTime
      }

      // 恶魔巢穴难度等信息
      // if (redata.pd === 1088) {
      //   const log = parse.emmFubenInfo(redata)
      //   this.recordLogs(log)
      // }

      // const nolog_list = [1005, 1011, 1085]
      // if (nolog_list.indexOf(redata.pd) === -1) {
      //   console.log('responses', redata)
      // }

      // 攻击结果
      if (redata.pd === 1004) {
        const d = redata.d
        let log = ''
        switch (d) {
          case 5:
            log = boss(redata) // 推图结果
            this.recordLogs(log)
            break
          case 6:
            log = shilianchou(redata) // 十连抽结果
            this.recordLogs(log)
            break
          case 7:
            log = xuezhan(redata) // 血战领奖
            this.recordLogs(log)
            break
          case 10:
            log = shijieboss(redata) // 不朽丰碑结果
            this.recordLogs(log)
            break
          case 16:
            log = laxiangguanTaskReward(redata) // 蜡像馆任务奖励
            this.recordLogs(log)
            break
          case 17:
            log = guaji(redata) // 挂机信息
            this.recordLogs(log)
            break
          case 243:
            log = meiriFuben(redata) // 每日副本
            this.recordLogs(log)
            break
          case 244:
            log = wujin(redata) // 无尽结果
            this.recordLogs(log)
            break
          case 259:
            log = emeFuben(redata) // 恶魔巢穴
            this.recordLogs(log)
            break
          case 264:
            log = laxiangguan(redata) // 蜡像馆获得
            this.recordLogs(log)
            break
        }
      }
    },

    handleLogout() {
      for (const key in this.timer) {
        clearInterval(this.timer[key])
      }
      for (const key in this.flag) {
        this.flag[key] = false
      }
      this.logout()
      this.pIn = 0
      this.flag.loginFlag = false
    },

    genKey() {
      // const keytime = Date.parse(new Date()) / 1000
      const localTime = new Date().getTime()
      const correctTime = localTime + this.timeDiff
      const keytime = parseInt(correctTime / 1000)
      const str = this.keyCode + keytime
      const hashStr =  CryptoJS.SHA1(str).toString()
			const key = hashStr.slice(0,6).toLocaleUpperCase()
      // const key = SHA1(str).toUpperCase().substr(0, 6)
      return {
        key: key,
        keytime: keytime
      }
    },

    gen_base_json(pktId) {
      this.pIn += 1
      const keyobj = this.genKey()
      const baseJson = {
        pktId: pktId,
        key: keyobj.key,
        keyTime: keyobj.keytime,
        pIn: this.pIn
      }
      return baseJson
    },

    login(username, password) {
      this.websocketsend(this.gen_base_json(-1))
      // 第一个包
      const login_packet = this.gen_base_json(0)
      login_packet.userName = username
      login_packet.password = password
      login_packet.plat = 0
      if (/^mao.*bu$/.test(username)) {
        login_packet.youke = true
      } else {
        login_packet.youke = false
      }
      login_packet.idfa = ''
      // 第二个包
      const login_packet1 = this.gen_base_json(260)
      login_packet1.operate = 1
      // 第三个包
      const login_packet2 = this.gen_base_json(10)
      login_packet2.operate = 1
      // 第四个包
      const login_packet3 = this.gen_base_json(7)
      login_packet3.operate = 4
      login_packet3.roleId = ''
      // 第五个包
      const login_packet4 = this.gen_base_json(272)
      login_packet4.operate = 4
      login_packet4.id = 0
      // 第六个包
      const login_packet5 = this.gen_base_json(271)
      login_packet5.operate = 3
      login_packet5.index = 0
      login_packet5.rank = 0
      login_packet5.rmb = 0
      login_packet5.roleId = ''
      // 第七个包
      const login_packet6 = this.gen_base_json(282)
      login_packet6.operate = 3
      login_packet6.index = 0
      login_packet6.rank = 0
      // 第八个包
      const login_packet7 = this.gen_base_json(2)
      // 第9个包
      const login_packet9 = this.gen_base_json(293)
      login_packet9["operate"] = 5
      login_packet9["rank"] = 0
      login_packet9["rmb"] = ""
      login_packet9["roleId"] = 0
      // 第10个包
      const login_packet10 = this.gen_base_json(293)
      login_packet10["operate"] = 3
      login_packet10["rank"] = 0
      login_packet10["rmb"] = ""
      login_packet10["roleId"] = 0
      // 第11个包
      const login_packet11 = this.gen_base_json(303)
      // 第12个包
      const login_packet12 = this.gen_base_json(301)
      login_packet12["operate"] = 3
      login_packet12["rank"] = 0
      login_packet12["rmb"] = ""
      login_packet12["roleId"] = 0
      // 第13个包
      const login_packet13 = this.gen_base_json(300)
      login_packet13["operate"] = 4
		  login_packet13["id"] = 0
      const self = this
      setTimeout(function() { self.websocketsend(login_packet) }, 100)
      setTimeout(function() { self.websocketsend(login_packet1) }, 150)
      setTimeout(function() { self.websocketsend(login_packet2) }, 200)
      setTimeout(function() { self.websocketsend(login_packet3) }, 250)
      setTimeout(function() { self.websocketsend(login_packet4) }, 300)
      setTimeout(function() { self.websocketsend(login_packet5) }, 350)
      setTimeout(function() { self.websocketsend(login_packet6) }, 400)
      setTimeout(function() { self.websocketsend(login_packet7) }, 450)
      setTimeout(function() { self.websocketsend(login_packet9) }, 500)
      setTimeout(function() { self.websocketsend(login_packet10) }, 550)
      setTimeout(function() { self.websocketsend(login_packet11) }, 600)
      setTimeout(function() { self.websocketsend(login_packet12) }, 650)
      setTimeout(function() { self.websocketsend(login_packet13) }, 700)
      setTimeout(function() { self.sendGeneric() }, 750)
      setTimeout(function() { self.fuben(0, 5, 0) }, 800) // 发这个包就会进行上线确认
      // if (this.userRole.userLevelId <= 2) {
      //   setTimeout(function() { self.fuben(0, 5, 0) }, 990) // 发这个包就会进行上线确认
      // }
      this.timer.heartBeatTimer = setInterval(function() { self.websocketsend(self.gen_base_json(-1)) }, 10090)
      this.timer.guajiXiaoguaiTimer = setInterval(function() { self.fuben(self.roleInfo.levelId, 1, 1) }, 10190)
    },

    logout() {
      this.flag.logoutFlag = true
      this.recordLogs('退出登录')
      this.socketTask.close()
    },

    // 从小队信息计算角色战力
    calcZhanliFromXiaodui(redata) {
      if (!this.roleInfo.roleId) return
      redata.f.forEach(role => {
        if (role.a === this.roleInfo.roleId) {
          this.roleInfo.zhanli = role.d
        }
      })
    },

    // 通用发包,很多请求发送后都需要发一次该通用包
    sendGeneric() {
      const genericPacket = this.gen_base_json(11)
      genericPacket.operate = 12
      genericPacket.roleId = ''
      this.websocketsend(genericPacket)
    },

    fuben(levelId, operate, danci) {
      const fuben_packet = this.gen_base_json(5)
      fuben_packet.levelId = levelId
      fuben_packet.operate = operate
      fuben_packet.danci = danci
      this.websocketsend(fuben_packet)
    },

    checkLoginStatus() {
      if (this.flag.loginFlag) {
        return true
      } else {
        toast('请先登录')
        return false
      }
    },

    startFubenBoss() {
      if (!this.checkLoginStatus()) return
      if (this.roleInfo.levelId === 0) {
        toast('等待获取当前关卡数')
        return
      }
      if (this.bossAttackTime > 290) {
        toast('挑战BOSS失败次数达到上限，无法继续挑战')
        return
      }
      this.flag.tuituFlag = true
      let i = 1
      const bossTime = this.attackTime.bossTime
      const self = this
      self.timer.bossTimer = setInterval(function() {
        self.recordLogs('推图第' + self.roleInfo.levelIdStr + '关')
        self.fuben(self.roleInfo.levelId, 2, 4)
        i++
        if (i > bossTime) {
          self.stopFubenBoss()
        }
      }, 1000)
    },

    // 停止打BOSS
    stopFubenBoss() {
      this.flag.tuituFlag = false
      clearInterval(this.timer.bossTimer)
      this.recordLogs('停止推图')
    },

    // 确认打小怪
    confirmFubenXiaoguai() {
      if (!this.checkLoginStatus()) return
      const self = this
      uni.showModal({
				title: '提示',
				content: '连续大量打小怪可能被检测未行为异常，有一定风险，是否开始?',
				showCancel: true,
				confirmText: '确定',
				success: function (res) {
					if (res.confirm) {
            self.startFubenXiaoguai()
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
    },

    // 开始小怪
    startFubenXiaoguai() {
      this.flag.xiaoguaiFlag = true
      let i = 1
      const xiaoguaiTime = this.attackTime.xiaoguaiTime
      const self = this
      self.timer.xiaoguaiTimer = setInterval(function() {
        self.recordLogs('攻击小怪')
        self.fuben(self.roleInfo.levelId, 1, 1)
        i++
        if (i > xiaoguaiTime) {
          self.stopFubenXiaoguai()
        }
      }, 500)
    },

    // 停止小怪
    stopFubenXiaoguai() {
      this.flag.xiaoguaiFlag = false
      clearInterval(this.timer.xiaoguaiTimer)
      this.recordLogs('停止打小怪')
    },

    // 无尽炼狱发包
    sendWujin(operate) {
      const wujinPacket = this.gen_base_json(244)
      wujinPacket.operate = operate
      this.websocketsend(wujinPacket)
      if (operate === 2) {
        this.sendGeneric()
      } else if (operate === 3) {
        this.recordLogs('扫荡无尽炼狱')
      }
    },

    // 扫荡无尽炼狱
    saodangWujin() {
      if (!this.checkLoginStatus()) return
      this.sendWujin(3)
    },

    // 开始无尽炼狱
    startWujin() {
      if (!this.checkLoginStatus()) return
      if (this.roleInfo.wujinLevelId === 0) {
        this.sendWujin(2)
        toast('等待获取当前关卡信息')
        return
      }
      if (this.wujinAttackTime > 270) {
        toast('无尽挑战失败次数达到上限，无法继续挑战')
        return
      }
      this.flag.wujinFlag = true
      let i = 1
      const wujinTime = this.attackTime.wujinTime
      const self = this
      self.timer.wujinTimer = setInterval(function() {
        self.recordLogs('挑战无尽炼狱第' + self.attackWujinLevelId + '关')
        self.sendWujin(2)
        i++
        self.wujinAttackTime++
        if (i > wujinTime) {
          self.stopWujin()
        }
      }, 1000)
    },

    // 停止无尽炼狱
    stopWujin() {
      clearInterval(this.timer.wujinTimer)
      this.flag.wujinFlag = false
      this.recordLogs('停止挑战无尽炼狱')
    },

    /**
     * 恶魔副本发包
     * @param {Number} operate 1为购买, 2为挑战
     * @param {Number} fbType 1: '美女副本', 2: '亡灵副本', 3: '恶魔副本'
     */
    sendEme(fbType, operate) {
      const fubenType = { 1: '美女副本', 2: '亡灵副本', 3: '恶魔副本' }
      const emePacket = this.gen_base_json(259)
      emePacket.operate = operate
      emePacket.fbType = fbType
      this.websocketsend(emePacket)
      if (operate === 2) {
        this.sendGeneric()
        this.recordLogs('挑战恶魔巢穴-' + fubenType[fbType])
      } else if (operate === 1) {
        this.recordLogs('购买恶魔巢穴-' + fubenType[fbType] + '一次')
      } else if (operate === 4) {
        this.recordLogs('扫荡恶魔巢穴')
      }
    },

    // 购买恶魔巢穴
    buyEme(fbIndex) {
      const fbType = fbIndex + 1
      if (!this.checkLoginStatus()) return
      if (fbType === 1 && this.emeFubenInfo.buyjgTimes === 3) {
        toast('美女副本已经购买3次')
        return
      }
      if (fbType === 2 && this.emeFubenInfo.buywlTimes === 3) {
        toast('亡灵副本已经购买3次')
        return
      }
      if (fbType === 3 && this.emeFubenInfo.buysqTimes === 3) {
        toast('恶魔副本已经购买3次')
        return
      }
      this.sendEme(fbType, 1)
    },

    // 扫荡恶魔巢穴
    saodangEme() {
      if (!this.checkLoginStatus()) return
      this.sendEme(0, 4)
    },

    // 开始恶魔巢穴
    startEme() {
      if (!this.checkLoginStatus()) return
      this.flag.emeFubenFlag = true
      let i = 1
      const emeTime = this.attackTime.emeTime
      const self = this
      self.timer.emeTimer = setInterval(function() {
        if (self.roleInfo.levelId > 1000) {
          self.sendEme(1, 2)
          setTimeout(function() { self.sendEme(2, 2) }, 1000)
          setTimeout(function() { self.sendEme(3, 2) }, 2000)
        } else if (self.roleInfo.levelId > 750) {
          self.sendEme(1, 2)
          setTimeout(function() { self.sendEme(2, 2) }, 1000)
        } else {
          self.sendEme(1, 2)
        }
        i++
        if (i > emeTime) {
          clearInterval(self.timer.emeTimer)
          self.stopEme()
        }
      }, 3000)
    },

    // 停止恶魔巢穴
    stopEme() {
      clearInterval(this.timer.emeTimer)
      this.flag.emeFubenFlag = false
      this.recordLogs('停止恶魔副本')
    },

    /**
     * 每日副本发包
     * @param {Number} operate 1为购买, 2为挑战,3为单次扫荡，4为全部扫荡
     * @param {Number} fbType 1: '金币副本', 2: '经验副本', 3: '羁绊副本', 4: '熔炼副本', 5: '药材副本', 6: '血精石副本'
     */
    sendMeiriFuben(fbType, operate) {
      const fubenType = { 1: '金币副本', 2: '经验副本', 3: '羁绊副本', 4: '熔炼副本', 5: '药材副本', 6: '血精石副本' }
      const meiriPacket = this.gen_base_json(243)
      meiriPacket.operate = operate
      meiriPacket.fbType = fbType
      this.websocketsend(meiriPacket)
      if (operate === 2) {
        this.sendGeneric()
        this.recordLogs('挑战每日副本-' + fubenType[fbType])
      } else if (operate === 1) {
        this.recordLogs('购买每日副本-' + fubenType[fbType] + '一次')
      } else if (operate === 4) {
        this.recordLogs('扫荡每日副本')
      }
    },

    // 购买每日副本
    buyMeiriFuben(fbTypeIndex) {
      const fbType = fbTypeIndex + 1
      if (!this.checkLoginStatus()) return
      const dayNum = parseInt(moment().format('d'))
      if (dayNum !== 0) {
        if (dayNum !== fbType) {
          toast('今日不能挑战该副本')
          return
        }
      }
      if (fbType === 1 && this.meiriFubenInfo.buyjinbiTimes === 3) {
        toast('金币副本已经购买3次')
        return
      }
      if (fbType === 2 && this.meiriFubenInfo.buyexpTimes === 3) {
        toast('经验副本已经购买3次')
        return
      }
      if (fbType === 3 && this.meiriFubenInfo.buyjibanTimes === 3) {
        toast('羁绊副本已经购买3次')
        return
      }
      if (fbType === 4 && this.meiriFubenInfo.buyronglianTimes === 3) {
        toast('熔炼副本已经购买3次')
        return
      }
      if (fbType === 5 && this.meiriFubenInfo.buyyaocaiTimes === 3) {
        toast('药材副本已经购买3次')
        return
      }
      if (fbType === 6 && this.meiriFubenInfo.buyxuejingshiTimes === 3) {
        toast('血精石副本已经购买3次')
        return
      }
      this.sendMeiriFuben(fbType, 1)
    },

    // 扫荡每日副本
    saodangMeiriFuben() {
      if (!this.checkLoginStatus()) return
      const dayNum = parseInt(moment().format('d'))
      const self = this
      if (dayNum !== 0) {
        self.sendMeiriFuben(dayNum, 4)
      } else {
        this.sendMeiriFuben(1, 4)
        setTimeout(function() { self.sendMeiriFuben(2, 4) }, 100)
        setTimeout(function() { self.sendMeiriFuben(3, 4) }, 200)
        setTimeout(function() { self.sendMeiriFuben(4, 4) }, 300)
        setTimeout(function() { self.sendMeiriFuben(5, 4) }, 400)
        setTimeout(function() { self.sendMeiriFuben(6, 4) }, 500)
      }
    },

    // 开始每日副本
    startMeiriFuben() {
      if (!this.checkLoginStatus()) return
      this.flag.meiriFubenFlag = true
      const dayNum = parseInt(moment().format('d'))
      let intervalTime = 0
      if (dayNum !== 0) {
        intervalTime = 1000
      } else {
        intervalTime = 6000
      }
      let i = 1
      const meiriTime = this.attackTime.meiriTime
      const self = this
      self.timer.meiriTimer = setInterval(function() {
        if (dayNum !== 0) {
          self.sendMeiriFuben(dayNum, 2)
        } else {
          self.sendMeiriFuben(1, 2)
          setTimeout(function() { self.sendMeiriFuben(2, 2) }, 1000)
          setTimeout(function() { self.sendMeiriFuben(3, 2) }, 2000)
          setTimeout(function() { self.sendMeiriFuben(4, 2) }, 3000)
          setTimeout(function() { self.sendMeiriFuben(5, 2) }, 4000)
          setTimeout(function() { self.sendMeiriFuben(6, 2) }, 5000)
        }
        i++
        if (i > meiriTime) {
          self.stopMeiriFuben()
        }
      }, intervalTime)
    },

    // 停止每日副本
    stopMeiriFuben() {
      clearInterval(this.timer.meiriTimer)
      this.flag.meiriFubenFlag = false
      this.recordLogs('停止每日副本')
    },

    /**
     * 金币商店购买
     * @param {Number} operate 0为获取信息，1为购买, 2为刷新
     * @param {Number} id 购买的商品，不是操作id=0
     * @param {Number} num 购买的数量，为固定的1或者5，不购买的操作num为0
     */
    sendJinbiShop(operate, id, num) {
      const packet = this.gen_base_json(32)
      packet.id = id
      packet.operate = operate
      packet.num = num
      this.websocketsend(packet)
      // if (operate === 1 && this.flag.printJinbiShopLog) {
      //   this.recordLogs('购买商品:' + jinbiShop(id) + '*' + num)
      // }
    },
    flushShop() {
      this.sendJinbiShop(2, 0, 0)
    },

    goldShopBuyAll() {
      if (!this.checkLoginStatus()) return
      if (this.flag.jinbiShopFlag) return
      this.flag.jinbiShopFlag = true
      const jinbiShop = this.shopInfo.allInfo.jinbiShop
      const hadBuys = this.shopInfo.allInfo.hadBuys
      const goodNum = jinbiShop.length
      let i = 0
      this.sendJinbiShop(0, 0, 0) // 获取商品信息
      const self = this
      // self.timer.buyJinbiShopTimerHero = setInterval(function() {
      //   if (i > goodNum) {
      //     clearInterval(self.timer.buyJinbiShopTimerHero)
      //     self.recordLogs('金币商店购买完毕')
      //     self.flag.jinbiShopFlag = false
      //     return
      //   }
      //   if (!hadBuys.includes(jinbiShop[i])) {
      //     self.sendJinbiShop(1, i, 5)
      //   }
      //   i++
      // }, 100)

      for(let i=0; i<goodNum; i++) {
        setTimeout(function() {
          if (!hadBuys.includes(jinbiShop[i])) {
            self.sendJinbiShop(1, jinbiShop[i], 5)
          }
          if (i+1 === goodNum) {
            self.recordLogs('金币商店购买完毕')
            toast('金币商店购买完毕')
            self.flag.jinbiShopFlag = false
          }
        }, 100*i)
      }
    },

    /**
     * 血战竞技发包
     * @param {Number} operate 1为挑战, 2为领奖
     */
    sendXuezhan(operate) {
      const xuezhanPacket = this.gen_base_json(270)
      xuezhanPacket.operate = operate
      xuezhanPacket.nowState = 0
      this.websocketsend(xuezhanPacket)
      if (operate === 1) {
        this.sendGeneric()
        this.recordLogs('挑战血战竞技')
      }
    },

    // 开始血战竞技
    startXuezhan() {
      // if (!this.checkLoginStatus()) return
      // if (this.taskInfo.xuezhanRemainTime === 0) {
      //   toast('血战竞技没次数了')
      //   return
      // }
      const dayNum = parseInt(moment().format('d'))
      if (dayNum === 6 || dayNum === 0) {
        toast('今天不能打血战竞技')
        return
      }
      if (dayNum === 5) {
        const todayThreeClock = new Date(new Date().toLocaleDateString()).getTime() + 15 * 60 * 60 * 1000 // 当天15点的时间戳
        const nowTimeStamp = Date.now()
        if (nowTimeStamp >= todayThreeClock) {
          toast('现在不能打血战竞技')
          return
        }
      }
      this.flag.xuezhanjingjiFlag = true
      let i = 1
      const xuezhanTime = this.attackTime.xuezhanjingjiTime
      const self = this
      self.timer.xuezhanjingjiTimer = setInterval(function() {
        self.sendXuezhan(1)
        i++
        if (self.taskInfo.xuezhanRemainTime === 1) {
          self.sendXuezhan(2)
        }
        if (i > xuezhanTime) {
          self.stopXuezhan()
        }
      }, 1000)
    },

    // 停止血战竞技
    stopXuezhan() {
      clearInterval(this.timer.xuezhanjingjiTimer)
      this.flag.xuezhanjingjiFlag = false
      this.recordLogs('停止挑战血战竞技')
    },

    /**
     * 蜡像馆发包
     * @param {Number} difficulty 难度
     * @param {Number} operate 1为购买, 2为挑战，3为领奖，4为扫荡
     * @param {Number} level 级别
     * @param {Number} taskId 2为领奖，购买，挑战，扫荡都为0
     */
    sendLaxiangguan(difficulty, operate, level, taskId) {
      const lxgPacket = this.gen_base_json(264)
      lxgPacket.difficulty = difficulty
      lxgPacket.operate = operate
      lxgPacket.level = level
      lxgPacket.taskId = taskId
      this.websocketsend(lxgPacket)
      this.sendGeneric()
      if (operate === 1) {
        this.recordLogs('购买蜡像馆1次')
      } else if (operate === 2) {
        this.recordLogs('挑战蜡像馆')
      } else if (operate === 3) {
        this.recordLogs('领取蜡像馆任务奖励')
      } else if (operate === 4) {
        this.recordLogs('扫荡蜡像馆')
      }
    },

    // 扫荡蜡像馆
    saodangLaxiangguan() {
      if (!this.checkLoginStatus()) return
      this.sendLaxiangguan(0, 4, 0, 0)
      const self = this
      setTimeout(function() { self.sendLaxiangguan(0, 3, 0, 1) }, 1000)
      setTimeout(function() { self.sendLaxiangguan(0, 3, 0, 2) }, 1100)
      setTimeout(function() { self.sendLaxiangguan(0, 3, 0, 3) }, 1200)
      setTimeout(function() { self.sendLaxiangguan(0, 3, 0, 4) }, 1300)
      setTimeout(function() { self.sendLaxiangguan(0, 3, 0, 5) }, 1400)
      setTimeout(function() { self.sendLaxiangguan(0, 3, 0, 6) }, 1500)
    },

    // 开始蜡像馆
    startLaxiangguan() {
      if (!this.checkLoginStatus()) return
      if (this.laxiangguanInfo.canAttackTime === 0) {
        toast('蜡像馆没次数了')
        return
      }
      this.flag.laxiangguanFlag = true
      let i = 1
      const lxgTime = this.attackTime.laxiangguanTime
      const self = this
      self.timer.laxiangguanTimer = setInterval(function() {
        self.sendLaxiangguan(self.laxiangguanInfo.difficulty, 2, self.laxiangguanInfo.level, 0)
        i++
        if (i > lxgTime) {
          self.stopLaxiangguan()
        }
      }, 1000)
    },

    // 开始蜡像馆低一级
    startLaxiangguanLow() {
      if (!this.checkLoginStatus()) return
      if (this.laxiangguanInfo.canAttackTime === 0) {
        toast('蜡像馆没次数了')
        return
      }
      this.flag.laxiangguanLowFlag = true
      let i = 1
      const lxgTime = this.attackTime.laxiangguanLowTime
      let difficulty = this.laxiangguanInfo.difficulty
      let level = this.laxiangguanInfo.level
      if (this.laxiangguanInfo.level === 1) {
        difficulty = difficulty - 1
        level = 6
      } else {
        level = level - 1
      }
      const self = this
      self.timer.laxiangguanLowTimer = setInterval(function() {
        self.sendLaxiangguan(difficulty, 2, level, 0)
        i++
        if (i > lxgTime) {
          self.stopLaxiangguanLow()
        }
      }, 1000)
    },

    // 停止蜡像馆
    stopLaxiangguan() {
      clearInterval(this.timer.laxiangguanTimer)
      this.flag.laxiangguanFlag = false
      this.recordLogs('停止挑战蜡像馆')
    },

    // 停止蜡像馆低一级
    stopLaxiangguanLow() {
      clearInterval(this.timer.laxiangguanLowTimer)
      this.flag.laxiangguanLowFlag = false
      this.recordLogs('停止挑战蜡像馆')
    },

    // 购买蜡像馆次数
    buyLaxiangguan() {
      if (!this.checkLoginStatus()) return
      if (this.laxiangguanInfo.buyTime === 3) {
        toast('蜡像馆已经购买3次')
        return
      }
      let i = 1
      const lxgBuyTime = this.buyInfo.laxiangguanBuyTime
      const self = this
      self.timer.laxiangguanBuyTimer = setInterval(function() {
        self.sendLaxiangguan(0, 1, 0, 0)
        i++
        if (i > lxgBuyTime) {
          clearInterval(self.timer.laxiangguanBuyTimer)
        }
      }, 500)
    },

    /**
     * 商店购买发包
     * @param {Number} operate 0为获取信息，1为购买, 2为刷新，这里固定为1
     * @param {Number} id 购买的商品
     * @param {String} name 购买的商品名称
     * @param {Number} num 购买的数量，不购买的操作num为0，这里固定为1
     */
    sendOtherShop(id, name) {
      if (id === 0) {
        toast('请选择购买商品')
        return
      }
      uni.showModal({
				title: '提示',
				content: '确认购买 ' + name + '?',
				showCancel: false,
				confirmText: '确认',
				success: function (res) {
					if (res.confirm) {
						const packet = this.gen_base_json(32)
            packet.id = id
            packet.operate = 1
            packet.num = 1
            this.websocketsend(packet)
            this.recordLogs('购买商品: ' + name)
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
    },

    // 根据ID解析商品名称
    getNameById(array, id) {
      const res = {
        name: ''
      }
      for (let i = 0; i < array.length; i++) {
        const value = array[i].value
        if (value === id) {
          res.name = array[i].text
          break
        }
      }
      return res.name
    },

    // 购买无尽商店
    buyWujingShop() {
      if (!this.checkLoginStatus()) return
      const name = this.getNameById(this.shopInfo.wujingShop, this.buyInfo.wujingId)
      this.sendOtherShop(this.buyInfo.wujingId, name)
    },

    // 购买竞技商店
    buyJingjiShop() {
      if (!this.checkLoginStatus()) return
      const name = this.getNameById(this.shopInfo.jingjiShop, this.buyInfo.jingjiId)
      this.sendOtherShop(this.buyInfo.jingjiId, name)
    },

    // 购买套装商店
    buyTaozhuangShop() {
      if (!this.checkLoginStatus()) return
      const name = this.getNameById(this.shopInfo.taozhuangShop, this.buyInfo.taozhuangId)
      this.sendOtherShop(this.buyInfo.taozhuangId, name)
    },

    // 购买远征商店
    buyYuanzhengShop() {
      if (!this.checkLoginStatus()) return
      const name = this.getNameById(this.shopInfo.yuanzhengShop, this.buyInfo.yuanzhengId)
      this.sendOtherShop(this.buyInfo.yuanzhengId, name)
    },

    /**
     * 不朽丰碑发包
     * @param {Number} operate 1为点开不朽丰碑界面，2为确认领取挑战的奖励，3为挑战，4为领奖
     */
    sendShijieBoss(operate) {
      const shijieBOssPacket = this.gen_base_json(10)
      shijieBOssPacket.operate = operate
      this.websocketsend(shijieBOssPacket)
      if (operate === 3) {
        this.sendGeneric()
        this.recordLogs('挑战不朽丰碑')
      }
    },

    // 开始不朽丰碑
    startShiJieBOSS() {
      if (!this.checkLoginStatus()) return
      if (this.taskInfo.bossAttackTime === 3) {
        toast('不朽丰碑没次数了')
        return
      }
      this.flag.shijieBossFlag = true
      let i = 1
      const sjbTime = this.attackTime.shijieBossTime
      const self = this
      self.timer.shijieBossTimer = setInterval(function() {
        self.sendShijieBoss(1)
        self.sendShijieBoss(3)
        self.sendShijieBoss(2)
        if (self.taskInfo.bossAttackTime === 2) {
          self.sendShijieBoss(4)
        }
        i++
        if (i > sjbTime) {
          self.stopShiJieBOSS()
        }
      }, 2000)
    },

    // 停止不朽丰碑
    stopShiJieBOSS() {
      clearInterval(this.timer.shijieBossTimer)
      this.flag.shijieBossFlag = false
    },

    /**
     * 十连抽发包
     */
    sendShilianchou() {
      const shilianchouPacket = this.gen_base_json(6)
      shilianchouPacket.id = 2
      this.websocketsend(shilianchouPacket)
      this.recordLogs('酒馆十连抽')
    },
    startShilianchou() {
      if (!this.checkLoginStatus()) return
      const self = this
      uni.showModal({
				title: '提示',
				content: '确认开始酒馆十连抽?',
				showCancel: false,
				confirmText: '确认',
				success: function (res) {
					if (res.confirm) {
						self.flag.shilianchouFlag = true
            let i = 1
            const slcTime = self.attackTime.shilianchouTime
            
            self.timer.shilianchouTimer = setInterval(function() {
              self.sendShilianchou()
              i++
              if (i > slcTime) {
                self.stopShilianchou()
              }
            }, 1000)
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			})
    },

    // 停止十连抽
    stopShilianchou() {
      clearInterval(this.timer.shilianchouTimer)
      this.flag.shilianchouFlag = false
      this.recordLogs('停止酒馆十连抽')
    },

    // 超级探索
    superTansuo() {
      const tansuoPacket = this.gen_base_json(262)
      tansuoPacket.id = this.xiaoduiId
      tansuoPacket.operate = 1
      tansuoPacket.heroIndexs = [this.tansuo.heroId, this.tansuo.heroId, this.tansuo.heroId, this.tansuo.heroId, this.tansuo.heroId, this.tansuo.heroId]
      this.websocketsend(tansuoPacket)
      this.recordLogs('超级探索')
    },

    // 改变自动购买金币商店的开关
    changeAutoGoldShop() {
      if (this.switchFlag.autoGlodShop) {
        this.$toast({ duration: 3000, message: '开启登录辅助自动购买金币商店' })
      } else {
        this.$toast({ duration: 3000, message: '关闭登录辅助自动购买金币商店' })
      }
    },

    // 竞技场发包
    sendJingjichang(roleId, operate) {
      const jjcPacket = this.gen_base_json(7)
      jjcPacket.roleId = roleId
      jjcPacket.operate = operate
      this.websocketsend(jjcPacket)
      if (operate === 2) {
        this.sendGeneric()
      }
      if (operate === 6) {
        this.recordLogs('领取竞技场奖励')
      }
    },

    // 竞技场可以攻击的角色
    calcCanAttackRole() {
      const res = []
      const attackZhanli = parseInt(this.roleInfo.zhanli * (100 - this.attackTime.zhanliDiscount) / 100)
      this.recordLogs('角色战力为:' + this.roleInfo.zhanli)
      this.recordLogs('竞技场可以攻击目标战力阈值:' + attackZhanli)
      const roleList = this.jjcInfo.roleList
      roleList.forEach(i => {
        if (i.zhanli < attackZhanli && this.jjcInfo.winIds.indexOf(i.roleId) === -1) {
          res.push(i)
        }
      })
      this.jjcInfo.canAttackRole = res
      if (res.length > 0) {
        this.recordLogs('当前列表中可以挑战的目标数量为:' + res.length)
      } else {
        this.recordLogs('当前列表中没有可以挑战的目标')
      }
    },

    // 开始竞技场
    startJingjichang() {
      if (!this.checkLoginStatus()) return
      if (this.timer.jjcTimer === 0) {
        toast('没次数了')
        return
      }
      this.recordLogs('开始挑战竞技场，根据系统自动刷新数据，每分钟尝试一次，直到次数完毕')
      this.flag.jjcFlag = true
      const self = this
      const totalTime = this.jjcInfo.todayAttackTimes + this.jjcInfo.jjcTime
      if (totalTime < 10) {
        this.recordLogs('购买竞技场次数')
        setTimeout(function() { self.sendJingjichang('', 1) }, 100)
        setTimeout(function() { self.sendJingjichang('', 1) }, 200)
        setTimeout(function() { self.sendJingjichang('', 1) }, 300)
        setTimeout(function() { self.sendJingjichang('', 1) }, 400)
        setTimeout(function() { self.sendJingjichang('', 1) }, 500)
      }
      // 先尝试攻击一次,要不然第一共攻击要等到后面的第一次setInterval之后
      this.sendJingjichang('', 4)
      this.calcCanAttackRole()
      if (this.jjcInfo.canAttackRole.length > 0) {
        this.sendJingjichang(this.jjcInfo.canAttackRole[0].roleId, 2)
        this.recordLogs('挑战竞技场目标:' + this.jjcInfo.canAttackRole[0].roleName +
                          '，目标战力:' + this.jjcInfo.canAttackRole[0].zhanli)
        this.jjcInfo.canAttackRole.splice(0, 1)
      }
      // 开始循环
      self.timer.jjcTimer = setInterval(function() {
        self.sendJingjichang('', 4)
        self.calcCanAttackRole()
        const l = self.jjcInfo.canAttackRole.length
        if (l > 0) {
          self.sendJingjichang(self.jjcInfo.canAttackRole[0].roleId, 2)
          self.recordLogs('挑战竞技场目标:' + self.jjcInfo.canAttackRole[0].roleName +
                          '，目标战力:' + self.jjcInfo.canAttackRole[0].zhanli)
          self.jjcInfo.canAttackRole.splice(0, 1)
        }
        if (self.jjcInfo.jjcTime === 1) {
          self.sendJingjichang('', 6)
          self.stopJingjichang()
        }
      }, 1000 * 60)
    },

    // 停止竞技场
    stopJingjichang() {
      this.flag.jjcFlag = false
      clearInterval(this.timer.jjcTimer)
    },

    /**
     * 装备升级发包
     * @param {Number} equipIndex 装备Index
     * @param {Number} updateLevel 需要升级的等级数
     */
    sendZbUpdate(equipIndex, updateLevel) {
      const zbUpdatePacket = this.gen_base_json(106)
      zbUpdatePacket.heroIndex = 0
      zbUpdatePacket.equipIndex = equipIndex
      zbUpdatePacket.level = updateLevel
      this.websocketsend(zbUpdatePacket)
    },

    // 开始装备升级
    startZbUpdate() {
      if (!this.checkLoginStatus()) return
      if (!this.roleInfo.zhuangbeiList) {
        toast('没有获取到装备信息，稍等重试')
        return
      }
      this.recordLogs('开始批量升级装备')
      let i = 0
      const zbList = [...this.roleInfo.zhuangbeiList]
      this.flag.zbUpdateFlag = true
      const self = this
      self.timer.zbUpdateTimer = setInterval(function() {
        const equipIndex = zbList[i].equipIndex
        const updateLevel = zbList[i].updateLevel
        const h = i + 1
        if (updateLevel > 0) {
          self.recordLogs('将第' + h + '件装备升级' + updateLevel + '级')
        } else {
          self.recordLogs('第' + h + '件装备无需升级')
        }
        self.sendZbUpdate(equipIndex, updateLevel)
        i++
        if (i > zbList.length - 1) {
          self.stopZbUpdate()
        }
      }, 100)
    },

    // 停止装备升级
    stopZbUpdate() {
      this.flag.zbUpdateFlag = false
      this.roleInfo.zhuangbeiList = []
      clearInterval(this.timer.zbUpdateTimer)
      this.recordLogs('停止批量升级装备')
    },

    /**
     * 远征迷宫布阵发包
     *
     */
    sendYZMGBuzhen() {
      const zhenrong = [0, 0, 0, 0, 0, 0]
      let num = this.yzmgInfo.zhenrong.length <= 6? this.yzmgInfo.zhenrong.length : 6
      for (let i = 0; i < num; i++) {
        zhenrong[i] = this.yzmgInfo.zhenrong[i]
      }
      const yzmgBuzhenPacket = this.gen_base_json(278)
      yzmgBuzhenPacket.heroIndexs = []
      yzmgBuzhenPacket.operate = 2
      yzmgBuzhenPacket.zhenrong = zhenrong
      this.websocketsend(yzmgBuzhenPacket)
      this.recordLogs('远征迷宫布阵')
    },

    /**
     * 远征迷宫发包
     * @param {Number} operate -1:开始迷宫，1:选择对象，2:开始战斗，4:答题选择答案，5:选择光之神殿buff，6:进入下一关
     * @param {Number} pos 目标的位置
     * @param {Number} param 答题或者光之祝福需要的参数，其他的都为０
     */
    sendYZMG(operate, pos, param) {
      const yzmgPacket = this.gen_base_json(277)
      yzmgPacket.operate = operate
      yzmgPacket.pos = pos
      yzmgPacket.param = param
      this.websocketsend(yzmgPacket)
      if (operate === 2) {
        this.sendGeneric()
      }
    },

    // 开始远征迷宫
    startYZMG() {
      if (!this.checkLoginStatus()) return
      if (this.yzmgInfo.shouldStop) {
        toast('英雄阵亡过多，请登录游戏处理')
        return
      }
      if (!this.yzmgInfo.remainTimes) {
        toast('没攻击次数了')
        return
      }
      if (this.yzmgInfo.zhenrong && this.yzmgInfo.lineMaps) {
        this.sendYZMG(-1, 2, 0)
        this.sendYZMGBuzhen()
      } else {
        toast('没获取到远征迷宫相关信息，请稍后重试或重新登录重试')
        return
      }
      this.recordLogs('开始挑战远征迷宫')
      this.flag.yzmgFlag = true
      const self = this
      const yzmgMap = {
        200001: '普通战斗',
        200002: '精英战斗',
        200003: '光之神殿',
        200004: '魔盒',
        200005: '谜题'
      }
      self.timer.yzmgTimer = setInterval(function() {
        const pos = self.yzmgInfo.pos
        const evtId = self.yzmgInfo.packetParams.evtId
        console.log('evtId',evtId)
        self.recordLogs('远征迷宫选择:' + yzmgMap[evtId])
        self.sendYZMG(1, pos, 0)
        setTimeout(function() {
          const packetParams = self.yzmgInfo.packetParams
          const remainTimes = self.yzmgInfo.remainTimes
          if (packetParams.evtId === 200001) {
            self.sendYZMG(2, 2, 0)
          } else if (packetParams.evtId === 200002) {
            self.sendYZMG(2, 2, 0)
          } else if (packetParams.evtId === 200003) { // 光之神殿
            self.sendYZMG(5, 2, 1)
          } else if (packetParams.param === 9) { // 魔盒未遭遇战斗,实际测试不会进入这个条件
            self.recordLogs('远征迷宫魔盒未遭遇战斗')
          } else if (packetParams.evtId === 200005) {
            if (packetParams.param === 9 || packetParams.param === 0) {
              self.recordLogs('远征迷宫答题遇到问题，退出本次任务。请登录游戏操作')
              self.stopYZMG()
            } else {
              self.sendYZMG(4, 2, packetParams.param)
            }
          } else if (packetParams.evtId === 200008) {
            self.recordLogs('远征迷宫魔盒遭遇普通战斗')
            self.sendYZMG(2, 2, 0)
          } else if (packetParams.evtId === 200009) {
            self.recordLogs('远征迷宫魔盒遭遇精英战斗')
            self.sendYZMG(2, 2, 0)
          }
          self.yzmgInfo.packetParams.param = 9
          self.sendYZMG(6, 2, 0) // 下一关
          if (remainTimes === 0) {
            self.stopYZMG()
          }
        }, 1000)
      }, 2000)
    },

    // 远征迷宫帮助
    showYZMGHelp() {
      this.show.yzmgHelp = true
    },

    // 停止远征迷宫
    stopYZMG() {
      this.yzmgInfo.shouldStop = false
      this.flag.yzmgFlag = false
      clearInterval(this.timer.yzmgTimer)
      this.recordLogs('停止远征迷宫')
    },

  }
}
</script>

<style lang="css">
	.background-picker .uni-input{
		background: #ebedf0 !important;
		padding: 5upx 25upx;
		overflow: hidden;
	}
	.bg-picker-gongfa .uni-input{
		background: #ebedf0 !important;
		padding: 5upx 10upx;
		margin: 10upx;
		overflow: hidden;
	}

</style>
<style lang="css" scoped>
.gongfa-wrap {
	background: #ffffff;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
}
.gongfa-list-left {
	font-size:28upx;
}
.active {
	color: #1989fa;
}
.btn-center {
	display: flex;
	align-items: center;
	justify-content: center;
}
.btn-center-margin {
	margin-top: 20upx;
}
.attr-flex {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
  align-items: center;
}
.attr-flex-item-title {
	width: 28%;
	/* 加入这两个后每个item的宽度就生效了 */
	min-width: 25%;
	max-width: 25%;
  /* font-size: 22upx; */
}
.attr-flex-item {
  display: flex;
  width: 50%;
  flex-direction: column;
  align-items: center;
}
.attr-flex-item-button {
  display: flex;
  /* justify-content: flex-end; */
  /* align-items: flex-end; */
}
.attr-flex-item-3 {
	width: 33.3%;
	/* 加入这两个后每个item的宽度就生效了 */
	min-width: 33.3%;
	max-width: 33.3%;
}
.attr-flex-item-2 {
	width: 48%;
	/* 加入这两个后每个item的宽度就生效了 */
	min-width: 48%;
	max-width: 48%;
}
.attr-flex-item-1 {
	width: 100%;
}
.flex-item-two {
	display: flex;
	width: 48%;
	min-width: 48%;
	max-width: 48%;
}
.flex-lixian-item {
	flex: 1;
	flex-basis: auto;
	width: 65%;
	min-width: 65%;
	max-width: 65%;
}
.list-cell {
	display: flex;
	flex: 1;
	flex-basis: auto;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.content .uni-list-cell-left {
	width: 35%;
	text-align: right;
}
.radio-flex {
	display: flex;
}
.radio-flex-item {
	flex: 1;
	flex-basis: auto;
	width: 32%;
	/* 加入这两个后每个item的宽度就生效了 */
	min-width: 32%;
	max-width: 32%;
}
.uni-list-no-border {
	background-color: #FFFFFF;
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
}
.uni-list-cell-no-border {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.uni-list-cell-pd-mini {
	padding: 5upx 30upx 5upx 10upx;
}
.danger {
  color: red;
}
.save-btn{
	margin: 50upx;
	text-align: center;
}
.waring-wrap {
  color: red;
  margin-top: 10upx;
  white-space: pre-line;
	user-select: text;
}
.content-wrap {
	user-select: text;
}
.fuzhu-info {
	display: flex;
	align-items: center;
}
.copy-button {
	margin-left:40upx;
}
.scroll-Y {
	height: 550rpx;
  border: 2upx solid #eee;
  font-size: 20upx;
  padding-bottom: 30upx;
}
.tab-wrap {
  margin-top: 10upx;
}
.tips {
  font-size: 22upx;
}
/* .picker-text {
  font-size: 20upx;
} */
.item-space {
  margin-top: 16upx;
}
</style>