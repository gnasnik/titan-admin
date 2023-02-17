<template>
  <div class="container">
    <Breadcrumb :items="['menu.cache', 'menu.cache.profile']" />
    <a-space direction="vertical" :size="16" fill>
      <OperationLog :cid="route.query.cid"/>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import OperationLog from './components/operation-log.vue';

  const route = useRoute();
</script>

<script lang="ts">
  export default {
    name: 'Basic',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .steps {
    max-width: 548px;
    margin: 0 auto 10px;
  }
</style>
