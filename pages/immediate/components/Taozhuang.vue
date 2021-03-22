<!--  -->
<template>
  <view>
    <view class="zhuangbei-wrap">
			<view v-for="(item) in zhuangbeiBuweiList" :key="item.key"  class="list-cell flex-item-two">
		    <view class="zhuangbei-list-left">{{item.label}}：</view>
		    <view class="uni-list-cell-db">
		      <picker @change="changeZhuangbei($event, item.key)" :value="choosedZhuangbei[item.key]" class="bg-picker-zhuangbei"  range-key="text" :range="zhuangbeiInfo[item.key]">
		          <view class="uni-input zhuangbei-list-left">{{zhuangbeiInfo[item.key][choosedZhuangbei[item.key]].text}}</view>
		      </picker>
		    </view>
		  </view>
      <view class="list-cell flex-item-two">
        <button type="primary" size="mini" @tap="queryShuxing">查询</button>
        <button type="primary" size="mini" @tap="clearChoose">重选</button>
      </view>
		</view>

    <view class="zhuangbei-wrap">
      <view class="shuxing-wrap">
        <view class="uni-divider">
          <view class="uni-divider__content">装备属性</view>
          <view class="uni-divider__line"></view>
        </view>
        <view class="shuxing-left">
          <view v-for="(item, index) in tzShuxing" :key="index" class="shuxing-text">{{item}}</view>
        </view>
      </view>
      <view class="shuxing-wrap">
        <view class="uni-divider">
          <view class="uni-divider__content">换算属性</view>
          <view class="uni-divider__line"></view>
        </view>
        <view class="shuxing-text">
          <view v-for="(item, index) in tzShuxingCalc" :key="index" class="shuxing-text">{{item}}</view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import { zhuangbei, taozhuang } from '@/api/game'
import { getValueByIndex,toast} from '@/utils/index'

const defaultChooseZB = {
  toubu: 0,
  jianbang: 0,
  shenti: 0,
  zhushou: 0,
  fushou: 0,
  shuangshou: 0,
  xianglian: 0,
  jiezhi: 0,
  xiezi: 0
}
export default {
  name: 'Taozhuang',
  data() {
    return {
      orgiZbInfo: {},
      tzShuxing: [],
      tzShuxingCalc: [],
      flag: {
        shuangshou: false,
        zhushou: false
      },
      zhuangbeiBuweiList: [
        {'key': 'toubu', 'label': '头部'},
        {'key': 'xianglian', 'label': '项链'},
        {'key': 'jianbang', 'label': '肩膀'},
        {'key': 'jiezhi', 'label': '戒指'},
        {'key': 'shenti', 'label': '身体'},
        {'key': 'xiezi', 'label': '鞋子'},
        {'key': 'zhushou', 'label': '主手'},
        {'key': 'fushou', 'label': '副手'},
        {'key': 'shuangshou', 'label': '双手'}
      ],
      zhuangbeiInfo: {
        toubu: [{'text': '请选择', 'value': 0}],
        jianbang: [{'text': '请选择', 'value': 0}],
        shenti: [{'text': '请选择', 'value': 0}],
        zhushou: [{'text': '请选择', 'value': 0}],
        fushou: [{'text': '请选择', 'value': 0}],
        shuangshou: [{'text': '请选择', 'value': 0}],
        xianglian: [{'text': '请选择', 'value': 0}],
        jiezhi: [{'text': '请选择', 'value': 0}],
        xiezi: [{'text': '请选择', 'value': 0}]
      },
      choosedZhuangbei: Object.assign({}, defaultChooseZB)
    }
  },

  components: {},

  computed: {},

  watch: {},

  created() {},

  mounted() {
    this.getZhuangbei()
  },

  onLoad() {
  },

  methods: {
    async getZhuangbei() {
      const res = await zhuangbei()
      this.orgiZbInfo = res.zhuangbei
      let zb = res.zhuangbei
      zb = JSON.parse(JSON.stringify(zb).replace(/name/g, 'text'))
      zb = JSON.parse(JSON.stringify(zb).replace(/tz_id/g, 'value'))
      let newZb = this.formatZhuangbeiInfo(zb)
      this.zhuangbeiInfo = { ...newZb }
    },
    formatZhuangbeiInfo(zbInfo) {
      const newItem = {'text': '请选择', 'value': 0}
      for (const buwei in zbInfo) {
        zbInfo[buwei].unshift(newItem)
      }
      return zbInfo
    },
    async queryShuxing() {
      const chooseArray = []
      for (const i in this.choosedZhuangbei) {
        if (this.choosedZhuangbei[i]) {
          const id =  getValueByIndex(this.zhuangbeiInfo[i], this.choosedZhuangbei[i])
          chooseArray.push(id)
        }
      }
      if (!chooseArray.length) {
        toast('请选择装备后查询')
        return
      }
      const param = {
        tzList: chooseArray
      }
      const res = await taozhuang(param)
      this.tzShuxing = res.shuxing.sx
      this.tzShuxingCalc = res.shuxing.calc_sx
    },
    clearChoose() {
      this.choosedZhuangbei = Object.assign({}, defaultChooseZB)
      this.flag.zhushou = false
      this.flag.shuangshou = false
    },
    changeZhuangbei(e, buwei) {
      const arr = ['zhushou', 'fushou']
      if (arr.includes(buwei) && this.choosedZhuangbei.shuangshou) {
        toast('已经选择双手武器')
        return
      }
      if (buwei === 'shuangshou' && (this.choosedZhuangbei.zhushou || this.choosedZhuangbei.fushou)) {
        toast('已经选择主手或副手武器')
        return
      }
      const index = e.target.value
			this.choosedZhuangbei[buwei] = index
    }
  }
}

</script>

<style lang="css">
.bg-picker-zhuangbei .uni-input{
	background: #ebedf0 !important;
	padding: 0upx 4upx;
	margin: 10upx;
	overflow: hidden;
}
</style>

<style lang='css' scoped>
.zhuangbei-wrap {
	background: #ffffff;
	display: flex;
	flex-wrap: wrap;
	align-items: start;
	justify-content: space-between;
}
/* .zhuangbei-list-left {
	font-size:23upx;
} */
.flex-item-two {
	display: flex;
  align-items: center;
	width: 48%;
	min-width: 48%;
	max-width: 48%;
}
.shuxing-wrap {
  width: 48%;
}
.shuxing-left {
  min-height: 100upx;
  border-right: 2upx solid  #ebedf0;
}
.shuxing-text {
  font-size: 22upx;
}
</style>
