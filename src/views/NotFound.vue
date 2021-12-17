<template>
  <div class="notfound__wrapper">
      <div class="notfound__status">404</div>
      <div>Страница не найдена</div>
  </div>
</template>

<script>
export default {
    name: 'NotFound',
}
</script>

<style lang="scss">
    .notfound {

        &__wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            text-align: center;
            flex-direction: column;
            min-height: 100vh;
            height: 100%;  
        }

        &__status {
            font-weight: bolder;
            font-size: 34px;
        }
    }
</style>