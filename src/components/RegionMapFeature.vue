<template>
  <l-geo-json
    ref="geoJson"
    :geojson="geojson"
    :options="options"
    :options-style="optionsStyle"
  />
</template>
<script>
import { LGeoJson } from "vue2-leaflet";
import { get } from 'axios'
export default {
  data() {
    return {
      zoom: 1.2,
      center: [45, 0],
      geojson: null,
      mapControls: {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false
      },
    }
  },
  props: ['region-colours', 'data',
    'opacity', 'region', 'region-name',
    'selectedRegions'],
  components: {
    LGeoJson
  },
  computed: {
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
    filterRegions: {
      get() {
        return this.selectedRegions
      },
      set: function(newValue) {
        this.$emit('update:selectedRegions', newValue)
      }
    },
    onEachFeatureFunction() {
      return (feature, layer) => {
        layer.on('mouseover', (e) => {
          e.target.setStyle({
            fillOpacity: 1
          });
        })
        layer.on('mouseout', (e) => {
          e.target.setStyle({
            fillOpacity: this.fillOpacity
          });
        })
        layer.on('click', () => {
          this.clickRegion()
        })
        layer.bindTooltip(
          this.regionName,
          { permanent: false, sticky: true }
        );
      };
    },
    fillOpacity() {
      return this.opacity[this.regionName] || 0
    },
    optionsStyle() {
      const _fillColor = this.regionColours[this.regionName] || "#ffffff"
      return {
        fillColor: _fillColor,
        weight: 1,
        opacity: .5,
        color: '#bbbbbb',
        fillOpacity: this.fillOpacity
      }
    }
  },
  methods: {
    clickRegion() {
      const index = this.filterRegions.indexOf(this.regionName);
      if (index > -1) {
        this.filterRegions.splice(index, 1);
      } else {
        this.filterRegions.push(this.regionName)
      }
    },
    getGeoJSON() {
      get(`https://cr-visualisation.github.io/cr-visualisation/map/${this.region}.geojson`)
      .then(response => {
        this.geojson = response.data
      })
    }
  },
  mounted() {
    this.getGeoJSON()
  }
}
</script>