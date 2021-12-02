<template>
  <b-container class="visualisation-container" fluid>
    <b-row>
      <b-col>
        <h1>The $280 million ‘dark money’ global empire of the US Christian right</h1>
        <p class="lead">Since 2008, US Christian right groups, many of them linked to the Trump administration, and notorious for fighting LGBT and women’s reproductive rights, have spent more than $280 million of ‘dark money’ outside the US. Explore their empires of influence.</p>
      </b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col>
        <b-row>
          <b-col class="filter-buttons">
            <Filters
              :regions="regions"
              :selected-regions.sync="selectedRegions"
              :organisations="organisations"
              :selected-organisation.sync="selectedOrganisation"
              :years="years"
              :selected-years.sync="selectedYears"
              :categories="categoryColumns"
              :selected-category.sync="selectedCategory" />
          </b-col>
        </b-row>
        <b-row v-if="selectedOrganisation" class="mt-2">
          <b-col>
            <OrganisationInformationBox
              :selected-organisation="selectedOrganisation"
              :selected-organisation-text="selectedOrganisationText"
              :organisations-categories="organisationsCategories" />
          </b-col>
        </b-row>
        <b-row v-if="selectedCategory" class="mt-2">
          <b-col>
            <CategoryInformationBox
              :selected-category="selectedCategory" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="spending.length>0">
        <b-row class="mb-2">
          <b-col lg="6">
            <RegionMap
            :data="summarySpendingRegion"
            :region-colours="regionColours"
            :selected-regions.sync="selectedRegions" />
          </b-col>
          <b-col lg="6">
            <OrganisationSummaryTable
              :data="summarySpendingOrganisation"
              :selected-organisation.sync="selectedOrganisation" />
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="6">
            <RegionLineChart
            :data="regionLineChartData" />
          </b-col>
          <b-col lg="6">
            <RegionPieChart
              :data="summarySpendingRegion"
              :region-colours="regionColours" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
<style>
@font-face{
  font-family:'Open Sans';
  src:local("Open Sans"),url("https://cdn-prod.opendemocracy.net/assets/fonts/open-sans/OpenSans-Light.ttf");
  font-weight:300;
  font-style:normal;
  font-display:swap
}
@font-face{
  font-family:'Open Sans';
  src:local("Open Sans"),url("https://cdn-prod.opendemocracy.net/assets/fonts/open-sans/OpenSans-Regular.ttf");
  font-weight:400;
  font-style:normal;
  font-display:swap
}
@font-face{
  font-family:'Open Sans';
  src:local("Open Sans"),url("https://cdn-prod.opendemocracy.net/assets/fonts/open-sans/OpenSans-SemiBold.ttf");
  font-weight:600;
  font-style:normal;
  font-display:swap
}
@font-face{
  font-family:'Open Sans';
  src:local("Open Sans"),url("https://cdn-prod.opendemocracy.net/assets/fonts/open-sans/OpenSans-Bold.ttf");
  font-weight:700;
  font-style:normal;
  font-display:swap
}
@font-face{
  font-family:'Libre Baskerville';
  src:local("Libre Baskerville"),url("https://cdn-prod.opendemocracy.net/assets/fonts/libre-baskerville/LibreBaskerville-Regular.ttf");
  font-weight:400;
  font-display:swap
}
@font-face{
  font-family:'Libre Baskerville';
  src:local("Libre Baskerville"),url("https://cdn-prod.opendemocracy.net/assets/fonts/libre-baskerville/LibreBaskerville-Bold.ttf");
  font-weight:700;
  font-display:swap
}
.visualisation-container {
  padding: 20px 15px 30px 15px;
  font-family: 'Open Sans',sans-serif;
  background: '#ffffff';
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.visualisation-container h1 {
  font-family:'Libre Baskerville';
}
</style>
<script>
import Vue from 'vue'
import { get } from 'axios'
import csvtojson from 'csvtojson'
import { LayoutPlugin } from 'bootstrap-vue'
Vue.use(LayoutPlugin)
import { BCol, BRow, BContainer } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Filters from './components/Filters.vue'
import RegionMap from './components/RegionMap.vue'
import RegionLineChart from './components/RegionLineChart.vue'
import RegionPieChart from './components/RegionPieChart.vue'
import OrganisationSummaryTable from './components/OrganisationSummaryTable.vue'
import OrganisationInformationBox from './components/OrganisationInformationBox.vue'
import CategoryInformationBox from './components/CategoryInformationBox.vue'

export default {
  name: 'christian-right-visualisation',
  components: {
    BCol, BRow, BContainer, Filters,
    RegionMap, RegionLineChart, RegionPieChart,
    OrganisationSummaryTable,
    OrganisationInformationBox,
    CategoryInformationBox
  },
  data() {
    return {
      regions: ['Africa', 'Asia', 'Eurasia/Russia',
      'Europe', 'Latin America', 'Middle East & North Africa',
      'North America (outside the US)'],
      organisations: [],
      years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
      spending: [],
      selectedOrganisation: null,
      selectedRegions: [],
      selectedYears: [],
      selectedCategory: null,
      regionColours: {
        'Africa': '#94447c',
        'Asia': '#582a6c',
        'Eurasia/Russia': '#0f1756',
        'Europe': '#164080',
        'Latin America': '#256aa2',
        'Middle East & North Africa': '#3496bb',
        'North America (outside the US)': '#43c2ca'
      },
      categoryColumns: {
        'Trump connections (X = yes)': 'Trump connections',
        'WCF partner (X = yes)': 'WCF partner',
        'Anti-LGBT (X=yes)': 'Anti-LGBT',
        'Anti-abortion (X=yes)': 'Anti-abortion'
      },
      categoryColours: {
        'Trump connections': '#94447c',
        'WCF partner': '#582a6c',
        'Anti-LGBT': '#0f1756',
        'Anti-abortion': '#164080'
      }
    }
  },
  computed: {
    organisationsCategories() {
      return this.organisations.reduce((summary, item) => {
        summary[item['oD code']] = []
        Object.entries(this.categoryColumns).forEach(category => {
          if (item[category[0]] == 'X') {
            summary[item['oD code']].push(category[1])
          }
        })
        return summary
      }, {})
    },
    regionLineChartData() {
      const regions = this.summarySpendingRegionYears.map(region => {
        return {
          lineTension: 0,
          label: region.Region,
          backgroundColor: this.regionColours[region.Region],
          borderColor: this.regionColours[region.Region],
          fill: true,
          data: Object.values(region.Years),
          spanGaps: false
        }
      })
      return {
        labels: this.years,
        datasets: regions
      }
    },
    selectedOrganisationText() {
      return this.organisations.filter(org => {
        return this.selectedOrganisation == org["oD code"]
      }).map(item => {
        return item["Organisation"]
      }).join("")
    },
    summarySpendingOrganisationCategories() {
      const defaults = {
          'Total': 0.0,
          ...Object.values(this.categoryColumns).reduce((columns, column) => {
            columns[column] = {
              'Category': column,
              'Spending': 0
            }
            return columns
          }, {})
        }
      const summarySpend = this.filteredSpending.reduce((summary, item) => {
        const organisationCategories = this.organisationsCategories[item['oD code']]
        const _spending = item["Spending"]
        if (_spending == null) { return summary }
        organisationCategories.forEach(category => {
          summary[category].Spending += _spending
          summary['Total'] += _spending
        })
        return summary
      }, defaults)
      return summarySpend
    },
    summarySpendingRegion() {
      const summarySpend = this.filteredSpending.reduce((summary, item) => {
        const _region = item["Region"]
        const _spending = item["Spending"]
        if (_spending == null) { return summary }
        if (_region == "") { return summary }
        if (!(_region in summary)) {
          summary[_region] = {
            'Region': _region,
            'Spending': 0.0
          }
        }
        summary[_region].Spending += _spending
        summary['Total'] += _spending
        return summary
      }, {
        'Total': 0.0
      })
      return summarySpend
    },
    summarySpendingRegionYears() {
      return Object.values(this.filteredSpending.reduce((summary, item) => {
        const _region = item["Region"]
        const _year = item["Year"]
        const _spending = item["Spending"]
        if (_spending == null) { return summary }
        if (_region == "") { return summary }
        if (!(_region in summary)) {
          summary[_region] = {
            'Region': _region,
            'Years': this.years.reduce((_summary, year) => {
              _summary[year] = null
              return _summary
            }, {})
          }
        }
        if (summary[_region].Years[_year] == null) { summary[_region].Years[_year] = 0 }
        summary[_region].Years[_year] += _spending
        return summary
      }, {}))
    },
    summarySpendingOrganisation() {
      return Object.values(this.organisationsFiltersSpending.reduce((summary, item) => {
        if (!(item["oD code"] in summary)) {
          summary[item["oD code"]] = {
            'oD Code': item["oD code"],
            'Organisation Name': item["Organisation"],
            'Total Spend': 0.00
          }
          if ((this.selectedOrganisation != null) && (item["oD code"] == this.selectedOrganisation)) {
            summary[item["oD code"]]._rowVariant = "warning"
          }
        }
        if (item["Spending"] != null) {
          summary[item["oD code"]]["Total Spend"] += item["Spending"]
        }
        return summary
      }, {}))
    },
    organisationsFiltersSpending() {
      if ((this.selectedRegions.length == 0) &&
        (this.selectedYears.length == 0) &&
        (this.selectedCategory == null)) {
        return this.spending
      }
      const checkRegion = (item) => {
        if (this.selectedRegions.length == 0) { return true }
        return this.selectedRegions.includes(item["Region"])
      }
      const checkYear = (item) => {
        if (this.selectedYears.length == 0) { return true }
        return this.selectedYears.includes(item["Year"])
      }
      const checkCategory = (item) => {
        if (this.selectedCategory == null) { return true }
        const orgCategories = this.organisationsCategories[item["oD code"]]
        if (orgCategories == undefined) { return false }
        return orgCategories.includes(this.selectedCategory)
      }
      return this.spending.filter(item => {
        return checkRegion(item) && checkYear(item) && checkCategory(item)
      })
    },
    filteredSpending() {
      if ((this.selectedOrganisation == null) &&
        (this.selectedRegions.length == 0) &&
        (this.selectedYears.length == 0) &&
        (this.selectedCategory == null)) {
        return this.spending
      }
      const checkOrganisation = (item) => {
        if (this.selectedOrganisation == null) { return true }
        return this.selectedOrganisation == item["oD code"]
      }
      const checkRegion = (item) => {
        if (this.selectedRegions.length == 0) { return true }
        return this.selectedRegions.includes(item["Region"])
      }
      const checkYear = (item) => {
        if (this.selectedYears.length == 0) { return true }
        return this.selectedYears.includes(item["Year"])
      }
      const checkCategory = (item) => {
        if (this.selectedCategory == null) { return true }
        const orgCategories = this.organisationsCategories[item["oD code"]]
        if (orgCategories == undefined) { return false }
        return orgCategories.includes(this.selectedCategory)
      }
      return this.spending.filter(item => {
        return checkOrganisation(item) && checkRegion(item) && checkYear(item) && checkCategory(item)
      })
    }
  },
  mounted() {
    this.setupData()
  },
  methods: {
    async setupData() {
      function makeFloat(value) {
        const _value = parseFloat(value.replace(/,|\$/g, ""))
        if (isNaN(_value)) { return null }
        return _value
      }
      await get('https://cr-visualisation.github.io/cr-visualisation-2019/organisations.csv')
      .then(response => {
        csvtojson().fromString(response.data).then((jsonData=> {
          this.organisations = jsonData
        }))
      })
      await get('https://cr-visualisation.github.io/cr-visualisation-2019/spending.csv')
      .then(response => {
        csvtojson({colParser: {
            'Year': (item) => {
              return parseInt(item)
            },
            'Spending': (item) => {
              return makeFloat(item)
            }
          }}).fromString(response.data).then((jsonData=> {
          this.spending = jsonData
        }))
      })
    }
  }
}
</script>