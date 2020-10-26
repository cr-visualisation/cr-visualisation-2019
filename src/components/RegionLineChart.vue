<template>
  <div>
    <template v-if="data.datasets.length>0">
      <LineChart :data="data" :options="options">
      </LineChart>
      <p class="text-muted">Chart shows data by region for available years.</p>
    </template>
    <template v-else>
      <p class="text-muted">No data available for selected filters.</p>
    </template>
  </div>
</template>
<script>
import LineChart from './LineChart.vue'
export default {
  data() {
    return {
      stacked: true,
      valueLabel: "Total Spend"
    }
  },
  props: ['data'],
  components: {
      LineChart
  },
  computed: {
    options() {
      return {
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: ((tooltipItem, data) => {
              const _region = data.datasets[tooltipItem.datasetIndex].label
              const _value = tooltipItem.yLabel.toLocaleString(undefined, {
                maximumFractionDigits: 0
              })
              const label = `${this.valueLabel} (${_region}): $${_value}`;
              return label;
            })
          }
        },
        scales: {
          yAxes: [
            {
              stacked: this.stacked,
              ticks: {
                beginAtZero: true,
                callback: function(tick) {
                  const _formattedTick = tick.toLocaleString(undefined, {
                    maximumFractionDigits: 0
                  })
                  return `$${_formattedTick}`
                }
              },
              gridLines: {
                display: false
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                callback: function(tick) {
                  const characterLimit = 20
                  if (tick.length >= characterLimit) {
                    return (
                      tick
                        .slice(0, tick.length)
                        .substring(0, characterLimit - 1)
                        .trim() + '...'
                    )
                  }
                  return tick
                }
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    }
  }
}
</script>