<template>
  <div>
    <h4>{{ selectedCategory }}</h4>
    <span v-html="categoryDescriptionText"></span>
  </div>
</template>
<script>
import { get } from 'axios'
import MarkdownIt from 'markdown-it'
var md = new MarkdownIt()
export default {
  data() {
    return {
      categoryDescriptionText: null
    }
  },
  props: ['selected-category'],
  components: {
  },
  computed: {
  },
  methods: {
    getCategoryDescription() {
      get(`https://markbrough.github.io/christian-right-visualisation/category-summaries/${this.selectedCategory}.md`)
      .then(response => {
        this.categoryDescriptionText = md.render(response.data)
      })
      .catch(() => {
        this.categoryDescriptionText = null
      })
    }
  },
  mounted() {
    this.getCategoryDescription()
  },
  watch: {
    selectedCategory(category) {
      if (category!=null) {
        this.getCategoryDescription()
      }
    }
  }
}
</script>