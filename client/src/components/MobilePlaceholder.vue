<script setup lang="ts">
import background from '@/assets/background_unsplash_1.png'
import logo from '@/assets/mobile_nzpmc_logo.png'
import phone from '@/assets/phone.png'
</script>

<template>
  <div class="hide-for-desktop">
    <div class="mobile">
      <img class="mobile__background" :src="background" alt="background" />
      <div class="mobile__overlay"></div>
      <div class="mobile__container">
        <img class="mobile__container__logo" :src="logo" alt="logo" />
        <div class="mobile__container__title">{{ 'SORRY :(' }}</div>
        <img class="mobile__container__phone" :src="phone" alt="phone" />
        <p class="caption">Mobile displays are <span>not</span> supported</p>
        <p class="subcaption">Please use a desktop/laptop for sitting your exams</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mobile {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  &__overlay {
    height: 100vh;
    width: 100vw;
    background-color: black;
    opacity: 0.4;
  }

  &__background {
    position: absolute;
    object-fit: cover;
    height: 100%;
    min-width: 100%;
  }

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    z-index: 1;
    position: absolute;
    color: $white;
    letter-spacing: 0.2rem;
    text-align: center;
    padding: 18vw;
    gap: 2.5vh;

    &__logo {
      height: 9vh;
      margin-bottom: 4.8vh;
    }

    &__phone {
      height: 27vh;
      margin: 2.7vh 0;
    }

    &__title {
      font-weight: 800;
      font-size: 6.3vh;
    }

    .caption {
      font-size: 3.8vh;
      font-weight: 800;
      letter-spacing: 0.1rem;

      span {
        text-decoration: underline;
      }
    } 

    .subcaption {
      font-size: 2.7vh;
      letter-spacing: 0.1rem;
    }
  }
}
</style>
