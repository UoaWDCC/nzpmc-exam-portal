<template>
  <div class="site">
    <v-img
      width="100%"
      aspect-ratio="3"
      src="@/assets/logo-background.jpg"
      class="d-none d-sm-block"
    ></v-img>
  </div>
</template>

<script>
export default {
  name: "Site",

  metaInfo: {
    title: "Welcome",
    titleTemplate: "%s - NZPMC",
  },
};
</script>
