<template>
  <v-list-item
    :to="{
      name: 'AppExamQuestion',
      params: { quizID: $route.params.quizID, questionID: id }
    }"
    link
    :active-class="'selected-question-overlay'"
    class="question-link-container"
  >
    <v-container class="text-and-icon-container">
      <v-icon class="corner-icon" :color="flagColour(flagged)"> mdi-flag </v-icon>
      <v-list-item-content>
        <v-list-item-title>Question {{ number }}</v-list-item-title>
      </v-list-item-content>
      <v-icon class="corner-icon" id="answered-icon" :color="flagColour(answered)">
        {{ answered ? 'mdi-check-circle' : 'mdi-circle' }}
      </v-icon>
    </v-container>
  </v-list-item>
</template>

<script lang="ts">
export default {
  name: 'AppExamSidebarLink',

  props: {
    id: { type: String, required: true },
    number: { type: Number, required: true },
    answered: Boolean,
    flagged: Boolean
  },
  methods: {
    flagColour(flagged: boolean): string {
      if (flagged) {
        return 'secondary'
      } else {
        return 'white'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.text-and-icon-container {
  display: flex;
  gap: 0.5rem;
  padding: 0;

  #answered-icon {
    margin-left: auto;
  }
}

.v-navigation-drawer .v-list-item .corner-icon {
  overflow: visible;
  top: 0;
  right: 0;
  height: 16px;
  width: 16px;
  font-size: 16px;
  clip: revert;
  vertical-align: baseline;
}

.question-link-container {
  min-height: 30px;
  color: white;
  background-color: $examLightBlue;
}

.selected-question-overlay {
  background-color: $primary;
}

.app-exam-sidebar-link {
  display: flex;
}
</style>
