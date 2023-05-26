<script setup lang="ts">
</script>

<template>
  <div class="hide-for-desktop">
    <div class="mobile">
      <div class="mobile__title">{{ 'SORRY :(' }}</div>

      <p>Sorry about that.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile {
  background-color: orangered;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__title {
    font-size: 4rem;
    letter-spacing: 0.3rem;
    color: $white;
  }
}
</style>
