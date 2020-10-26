<template>
  <PieChart :data="pieChartData" :options="options">
  </PieChart>
</template>
<script>
import PieChart from './PieChart.vue'
export default {
  data() {
    return {}
  },
  props: ['data', 'region-colours'],
  components: {
    PieChart
  },
  computed: {
    pieChartData() {
      const _data = Object.values(this.data).reduce((summary, item) => {
            if (item.Region) {
              summary.push(item.Spending)
            }
            return summary
          }, [])
      const _labels  = Object.values(this.data).reduce((summary, item) => {
            if (item.Region) {
              summary.push(item.Region)
            }
            return summary
          }, [])
      return {
        datasets: [{
          data: _data,
          backgroundColor: _labels.map(region => {
            return this.regionColours[region]
          })
        }],
        labels: _labels
      }
    },
    options() {
      return {
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: ((tooltipItem, data) => {
              const _region = data.labels[tooltipItem.index]
              const _value = data.datasets[0].data[tooltipItem.index].toLocaleString(undefined, {
                maximumFractionDigits: 0
              })
              const label = `Total Spend (${_region}): $${_value}`;
              return label;
            })
          }
        }
      }
    }
  }
}
</script>