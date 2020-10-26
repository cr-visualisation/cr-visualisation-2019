<template>
  <div>
    <l-map
      class="region-map"
      :zoom="zoom"
      :center="center"
      :options="mapControls"
    >
    <RegionMapFeature
      v-for="region in regions"
      v-bind:key="region.region"
      :region-colours="regionColours"
      :data="data"
      :opacity="opacity"
      :region="region.region"
      :regionName="region.regionName"
      :selectedRegions.sync="filterRegions" />
    </l-map>
  </div>
</template>
<style>
.region-map {
  height: 350px !important;
  width: 100%;
  background: none;
}
</style>
<script>
import { LMap } from "vue2-leaflet";
import RegionMapFeature from './RegionMapFeature.vue'
import 'leaflet/dist/leaflet.css';
export default {
  data() {
    return {
      zoom: 1.2,
      center: [45, 0],
      regions: [
        {
          'region': 'Africa',
          'regionName': 'Africa'
        },{
          'region': 'Asia',
          'regionName': 'Asia'
        },
        {
          'region': 'EurasiaRussia',
          'regionName': 'Eurasia/Russia'
        },
        {
          'region': 'Europe',
          'regionName': 'Europe'
        },
        {
          'region': 'LatinAmerica',
          'regionName': 'Latin America'
        },
        {
          'region': 'MENA',
          'regionName': 'Middle East & North Africa'
        },
        {
          'region': 'NorthAmerica',
          'regionName': 'North America (outside the US)'
        }
      ],
      mapControls: {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
        keyboard: false,
        doubleClickZoom: false,
        boxZoom: false,
        tap: false,
        touchZoom: false
      }
    }
  },
  props: ['region-colours', 'data', 'selected-regions'],
  components: {
    LMap, RegionMapFeature
  },
  computed: {
    filterRegions: {
      get() {
        return this.selectedRegions
      },
      set: function(newValue) {
        this.$emit('update:selectedRegions', newValue)
      }
    },
    opacity() {
      return Object.entries(this.data).reduce((summary, item) => {
        if (item[1].Region == undefined) { return summary }
        summary[item[1].Region] = (item[1].Spending / this.data.Total)*3
        return summary
      }, {})
    }
  }
}
</script>