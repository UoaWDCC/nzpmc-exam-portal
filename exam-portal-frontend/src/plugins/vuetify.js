import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
    icons: {
        iconfont: 'material-icons',
        values: {
            complete: 'material-icons mi-check',
            cancel: 'material-icons mi-cancel',
            close: 'material-icons mi-close',
            delete: 'material-icons mi-delete',
            clear: 'material-icons mi-clear',
            success: 'material-icons mi-check',
            info: 'material-icons mi-info',
            warning: 'material-icons mi-warning',
            error: 'material-icons mi-error',
            prev: 'material-icons mi-navigate-before',
            next: 'material-icons mi-navigate-next',
            checkboxOn: 'material-icons mi-check-box',
            checkboxOff: 'material-icons mi-check-box-outline-blank',
            checkboxIndeterminate: 'material-icons mi-indeterminate-check-box',
            delimiter: 'material-icons mi-circle',
            sort: 'material-icons mi-sort',
            expand: 'material-icons mi-expand',
            menu: 'material-icons mi-menu',
            subgroup: 'material-icons mi-arrow-drop-down',
            dropdown: 'material-icons mi-arrow-drop-down',
            radioOn: 'material-icons mi-radio-button-checked',
            radioOff: 'material-icons mi-radio-button-unchecked',
            edit: 'material-icons mi-edit',
            ratingEmpty: 'material-icons mi-star-border',
            ratingFull: 'material-icons mi-star',
            ratingHalf: 'material-icons mi-half',
            // loading: '',
            first: 'material-icons mi-first-page',
            last: 'material-icons mi-last-page',
            unfold: 'material-icons mi-unfold-less',
            file: 'material-icons mi-insert-drive-file',
        },
    },
    theme: {
        options: {
            customProperties: true,
        },
        themes: {
            light: {
                primary: '#03a9f4',
                secondary: '#ff9e01',
                accent: '#3f51b5',
                error: '#f44336',
                warning: '#ffeb3b',
                info: '#00bcd4',
                success: '#4caf50',
            },
        },
    },
})
