<template lang="pug">
.d-flex.flex-column
  .lead {{ nft.mdata.name }}

  .row.mb-1
    .col
      small {{ $t('category') }}:
      |  {{ nft.category }}

  .row.mb-1
    .col
      b {{ $t('Immutable data:') }}
      ul
        li(v-for="item in iRows" v-if="item[1]")
          span.text-muted {{ item[0] }}:
          span  {{ item[1] }}
  .row
    .col
      b {{ $t('Mutable data') }}:
      ul
        li(v-for="item in mRows" v-if="item[1]")
          span.text-muted {{ item[0] }}:
          span  {{ item[1] }}

</template>

<script>
export default {
  props: ['nft'],

  computed: {
    iRows() {
      return Object.entries(this.nft.idata)
    },

    mRows() {
      return Object.entries(this.nft.mdata)
    }
  },

  methods: {
  }
}
</script>

<style scoped>
.lead {
  font-weight: 500;
}
</style>
