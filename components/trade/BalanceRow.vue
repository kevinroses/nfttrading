<template lang="pug">
// TODO Not used
.d-flex.label.mb-3
  span.text-success {{ $t('Buy') }} {{ token.symbol.name }}
  span.text-mutted.small.align-self-end.ml-auto {{ $t('balance:') }} {{ baseBalance }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user', 'tokenBalance', 'baseBalance'])
  }
}
</script>
