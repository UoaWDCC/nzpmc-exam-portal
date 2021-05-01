import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#03a9f4',
        secondary: '#009688',
        accent: '#3f51b5',
        error: '#f44336',
        warning: '#ffeb3b',
        info: '#00bcd4',
        success: '#4caf50',
      },
    },
  },  
});
