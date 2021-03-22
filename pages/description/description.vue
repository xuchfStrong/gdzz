<template>
  <view class="content">
    <uni-collapse accordion="true">
       <uni-collapse-item v-for="(mainItem, mainIndex) in description" :key="mainIndex"  :title="mainItem.title" :open="mainIndex === 0">
            <view class="collapse-content">
                <view v-for="content in mainItem.content" :key="content" class="item-wrap">{{ content }}</view>
            </view>
            <view v-for="(oneSubItem, indexSubitem) in mainItem.subItem" :key="indexSubitem" class="collapse-content">
                <view class="item-name">{{oneSubItem.subTitle}}</view>
                <view v-for="(oneSubContent, subContentIndex) in oneSubItem.subContent" :key="subContentIndex" class="item-wrap">
                  {{ oneSubContent }}
                </view>
            </view>
        </uni-collapse-item>
    </uni-collapse>
  </view>
</template>

<script>
import { getDescription } from '@/api/game'

export default {
  data() {
    return {
      description: []
    }
  },
  onLoad() {
    this.handleGetDescription()
  },

  methods: {
    handleGetDescription() {
      getDescription().then(res => {
        this.description = res
      })
    }
  }
}
</script>

<style lang="css" scoped>
  .uni-collapse-cell--open {
		background-color: #ffffff;
  }
  .collapse-content {
    padding: 10rpx 30rpx;
    user-select: text;
  }
  .item-name {
    padding-bottom: 20rpx;
  }
  .item-wrap {
    color: #969799;
    padding-bottom: 20rpx;
  }
</style>
