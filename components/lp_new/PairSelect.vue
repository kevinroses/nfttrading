<template lang="pug">
.card-title {{ $t('Add Liquidity') }}
  .section
    .section-header
      .title {{ $t('Select pair') }}
      .actions
        el-button(type="text")
          | {{ $t('Clear All') }}
    .pair-select-container
      PairSelectItem.first-pair(@click="onSelectToken('firstToken')" :token="firstToken")
      PairSelectItem.second-pair(@click="onSelectToken('secondToken')" :token="secondToken")
</template>

<script>
import PairSelectItem from '@/components/lp_new/PairSelectItem.vue'
export default {
  name: 'SelectPair',
  components: {
    PairSelectItem
  },
  props: ['token']
}
</script>

<style scoped lang="scss">
</style>
