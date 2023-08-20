import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: '#03a9f4',
        secondary: '#ff9e01',
        accent: '#3f51b5',
        error: '#f44336',
        warning: '#ffeb3b',
        info: '#00bcd4',
        success: '#4caf50'
      }
    }
  }
})
