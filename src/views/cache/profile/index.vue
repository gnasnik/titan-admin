<template>
  <div class="container">
    <Breadcrumb :items="['menu.cache', 'menu.cache.profile']" />
    <a-space direction="vertical" :size="16" fill>
      <OperationLog :cid="route.query.cid"/>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { queryCacheInfo, CacheInfoParams, CacheInfoRes } from '@/api/cache';
  import { queryProfileBasic, ProfileBasicRes } from '@/api/profile';
  import { useRoute } from 'vue-router';
  import OperationLog from './components/operation-log.vue';

  const route = useRoute();
  const { setLoading } = useLoading(true);
  const { setLoading: preSetLoading } = useLoading(true);
  const currentData = ref<CacheInfoRes>({} as CacheInfoRes);
  const preData = ref<ProfileBasicRes>({} as ProfileBasicRes);
  const step = ref(1);
  const fetchCurrentData = async () => {
    // try {
    //   const params: CacheInfoParams = { 'carfile_cid': route.query.cid}
    //   const { data } = await queryCacheInfo(params);
    //   currentData.value = data.CarfileReplicaInfos;
    //   step.value = 2;
    // } catch (err) {
    //   // you can report use errorHandler or other
    // } finally {
    //   setLoading(false);
    // }
  };
  const fetchPreData = async () => {
    try {
      const { data } = await queryProfileBasic();
      preData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      preSetLoading(false);
    }
  };
  fetchCurrentData();
  // fetchPreData();
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
