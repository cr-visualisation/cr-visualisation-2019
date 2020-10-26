<template>
  <div>
    <h4>{{ selectedOrganisationText }}</h4>
    <b-badge v-for="category in categories" v-bind:key="category" class="mr-1">{{ category }}</b-badge>
    <span v-html="organisationDescriptionText"></span>
  </div>
</template>
<script>
import { BBadge } from 'bootstrap-vue'
import { get } from 'axios'
import MarkdownIt from 'markdown-it'
var md = new MarkdownIt()
export default {
  data() {
    return {
      organisationDescriptionText: null
    }
  },
  props: ['selected-organisation',
    'selected-organisation-text',
    'organisations-categories'],
  components: {
    BBadge
  },
  computed: {
    categories() {
      return this.organisationsCategories[this.selectedOrganisation]
    }
  },
  methods: {
    getOrganisationDescription() {
      get(`https://markbrough.github.io/christian-right-visualisation/organisation-descriptions/${this.selectedOrganisation}.md`)
      .then(response => {
        this.organisationDescriptionText = md.render(response.data)
      })
      .catch(() => {
        this.organisationDescriptionText = null
      })
    }
  },
  mounted() {
    this.getOrganisationDescription()
  },
  watch: {
    selectedOrganisation(organisation) {
      if (organisation!=null) {
        this.getOrganisationDescription()
      }
    }
  }
}
</script>