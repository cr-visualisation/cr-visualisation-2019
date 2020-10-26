<template>
  <DoughnutChart :data="pieChartData" :options="options">
  </DoughnutChart>
</template>
<script>
import DoughnutChart from './DoughnutChart.vue'
export default {
  data() {
    return {}
  },
  props: ['data', 'category-colours'],
  components: {
    DoughnutChart
  },
  computed: {
    pieChartData() {
      const _data = Object.values(this.data).reduce((summary, item) => {
            if (item.Category) {
              summary.push(item.Spending)
            }
            return summary
          }, [])
      const _labels  = Object.values(this.data).reduce((summary, item) => {
            if (item.Category) {
              summary.push(item.Category)
            }
            return summary
          }, [])
      return {
        datasets: [{
          data: _data,
          backgroundColor: _labels.map(category => {
            return this.categoryColours[category]
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