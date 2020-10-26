<template>
  <div class="filter-buttons">
    <v-select
      class="mb-1"
      placeholder="All organisations"
      v-model="filterOrganisation"
      :options="organisations"
      label="Organisation"
      value="oD code"
      :reduce="org => org['oD code']"
      :get-option-label="getOrgLabel">
    </v-select>
    <v-select
      class="mb-1"
      placeholder="All organisation categories"
      v-model="filterCategory"
      :options="categoryKeys">
    </v-select>
    <v-select
      class="mb-1"
      placeholder="All regions"
      v-model="filterRegions"
      :options="regions"
      multiple>
    </v-select>
    <v-select
      class="mb-1"
      placeholder="All years"
      v-model="filterYears"
      :options="years"
      multiple>
    </v-select>
  </div>
</template>
<style>
.filter-buttons .vs__search::placeholder,
.filter-buttons .vs__dropdown-toggle,
.filter-buttons .vs__dropdown-menu {
  background: #cfe2f3ff;
  border: none;
  color: #394066;
  text-transform: lowercase;
  font-variant: small-caps;
}

.filter-buttons .vs__clear,
.filter-buttons .vs__open-indicator {
  fill: #ffffff;
}
</style>
<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
export default {
  components: {
    vSelect
  },
  props: [
    'regions', 'selectedRegions',
    'organisations', 'selectedOrganisation',
    'years', 'selectedYears',
    'selectedCategories', 'categories'
  ],
  data() {
    return {
    }
  },
  computed: {
    categoryKeys() {
      return Object.values(this.categories)
    },
    filterRegions: {
     // getter
      get: function () {
        return this.selectedRegions
      },
      // setter
      set: function (newValue) {
        this.$emit('update:selectedRegions', newValue)
      }
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
    filterYears: {
     // getter
      get: function () {
        return this.selectedYears
      },
      // setter
      set: function (newValue) {
        this.$emit('update:selectedYears', newValue)
      }
    },
    filterCategory: {
     // getter
      get: function () {
        return this.selectedCategory
      },
      // setter
      set: function (newValue) {
        this.$emit('update:selectedCategory', newValue)
      }
    }
  },
  mounted() {
  },
  methods: {
    getOrgLabel(org) {
      return org["Organisation"]
    }
  }
}
</script>