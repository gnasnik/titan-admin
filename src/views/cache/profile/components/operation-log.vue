<template>
  <a-card class="general-card">
    <template #title>
      {{ $t('cacheProfile.title') }}: {{cid}}
    </template>
    <a-spin :loading="loading" style="width: 100%">
      <a-table :data="renderData">
        <template #columns>
          <!-- <a-table-column
            :title="$t('cacheProfile.column.CarfileHash')"
            data-index="CarfileHash"
          /> -->
          <a-table-column
            :title="$t('cacheProfile.column.DeviceID')"
            data-index="DeviceID"
          />
          <a-table-column
            :title="$t('cacheProfile.column.Status')"
            data-index="Status"
          >
            <template #cell="{ record }">
              <p v-if="record.Status === 0">
                <span class="circle"></span>
                <span>{{ $t('cacheProfile.cell.create') }}</span>
              </p>
              <p v-if="record.Status === 1">
                <span class="circle pass"></span>
                <span>{{ $t('cacheProfile.cell.running') }}</span>
              </p>
              <p v-if="record.Status === 2">
                <span class="circle pass"></span>
                <span>{{ $t('cacheProfile.cell.failed') }}</span>
              </p>
              <p v-if="record.Status === 3">
                <span class="circle pass"></span>
                <span>{{ $t('cacheProfile.cell.succeeded') }}</span>
              </p>              
            </template>
          </a-table-column>
          <a-table-column
            :title="$t('cacheProfile.column.DoneSize')"
            data-index="DoneSize"
          />
          <a-table-column
            :title="$t('cacheProfile.column.DoneBlocks')"
            data-index="DoneBlocks"
          />     
          <a-table-column
            :title="$t('cacheProfile.column.IsCandidate')"
            data-index="IsCandidate"
          >
            <template #cell="{ record }">
              <p v-if="record.IsCandidate === true">
                <!-- <span class="circle"></span> -->
                <span>{{ $t('cacheProfile.cell.yes') }}</span>
              </p>
              <p v-if="record.IsCandidate === false">
                <!-- <span class="circle pass"></span> -->
                <span>{{ $t('cacheProfile.cell.no') }}</span>
              </p>           
            </template>
          </a-table-column>                    
          <a-table-column
            :title="$t('cacheProfile.column.CreateTime')"
            data-index="CreateTime"
          />
          <a-table-column
            :title="$t('cacheProfile.column.EndTime')"
            data-index="EndTime"
          />          
        </template>
      </a-table>
    </a-spin>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { queryCacheInfo, CacheInfoParams, CacheInfoRes, CarfileReplicaInfo } from '@/api/cache';
  import useLoading from '@/hooks/loading';

  const props = defineProps({
    cid: {
      type: String || null,
    },
  });

  const route = useRouter();
  const { loading, setLoading } = useLoading(true);

  const renderData = ref<CarfileReplicaInfo[]>();
  const fetchData = async () => {
    try {
      const params: CacheInfoParams = { carfile_cid: props.cid }
      const { data } = await queryCacheInfo(params);
      renderData.value = data.CarfileReplicaInfos;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
</script>

<style scoped lang="less">
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
</style>
