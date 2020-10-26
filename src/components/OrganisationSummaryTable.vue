<template>
  <b-table
    class="small-caps"
    small
    :fields="summaryFields"
    :items="tableData"
    sort-by="TotalSpend"
    :sort-desc="true"
    sticky-header="370px"
  >
  <template v-slot:cell(OrganisationName)="data">
    <a href="#" @click.stop.prevent="setOrganisation(data.item['oDCode'])">{{ data.item["OrganisationName"] }}</a>
  </template>
  </b-table>
</template>
<style>
.number {
  text-align: right;
  text-transform: lowercase;
  font-variant: small-caps;
}
.small-caps td, .small-caps th {
  text-transform: lowercase;
  font-variant: small-caps;
}
</style>
<script>
import Vue from 'vue'
import { TablePlugin } from 'bootstrap-vue'
Vue.use(TablePlugin)
import { BTable } from 'bootstrap-vue'

export default {
  components: {
    BTable
  },
  props: ['data', 'selected-organisation'],
  data() {
    return {
      summaryFields: [
      {
        key: 'OrganisationName',
        sortable: true,
      },
      {
        key: 'TotalSpend',
        label: 'Total Spend',
        sortable: true,
        formatter: this.numberFormatter,
        thClass: 'number',
        tdClass: 'number'
      }]
    }
  },
  computed: {
    tableData() {
      return this.data.map(item => {
        return {
          'oDCode': item["oD Code"],
          'OrganisationName': item["Organisation Name"],
          'TotalSpend': item["Total Spend"],
          '_rowVariant': item["_rowVariant"]
        }
      })
    },
    filterOrganisation: {
     // getter
      get: function () {
        return this.selectedOrganisation
      },
      // setter
      set: function (newValue) {
        this.$emit('update:selectedOrganisation', newValue)
      }
    },
  },
  mounted() {
  },
  methods: {
    setOrganisation(oDCode) {
      if (this.filterOrganisation == oDCode) {
        this.filterOrganisation = null
      } else {
        this.filterOrganisation = oDCode
      }
    },
    numberFormatter(value) {
      if (value == null) { return null }
      const formattedNumber = value.toLocaleString(undefined, {
        maximumFractionDigits: 0
      })
      return `$${formattedNumber}`
    }
  }

}
</script>