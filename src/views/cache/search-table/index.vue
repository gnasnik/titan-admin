<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.searchTable']" />
    <a-card class="general-card" :title="$t('menu.list.searchTable')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="carfile_cid"
                  :label="$t('searchTable.form.carfile_cid')"
                >
                  <a-input
                    v-model="formModel.number"
                    :placeholder="$t('searchTable.form.carfile_cid.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <!-- <a-col :span="8">
                <a-form-item
                  field="createdTime"
                  :label="$t('searchTable.form.createdTime')"
                >
                  <a-range-picker
                    v-model="formModel.createdTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col> -->
              <!-- <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('searchTable.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col> -->
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 44px" direction="vertical" />
        <a-col :flex="'46px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleCreate">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
              <a-modal v-model:visible="visible" :title="$t('searchTable.operation.create.title')" @ok="handleSubmitCreate" @cancel="handleCancel">
                <a-form :model="createFormModel">
                <a-form-item field="carfile_cid" :label="$t('searchTable.columns.carfileCID')">
                    <a-input v-model="createFormModel.carfile_cid" />
                </a-form-item>
                <a-form-item field="reliability" :label="$t('searchTable.columns.needReliability')">
                    <a-input v-model.number="createFormModel.reliability" type="number"/>
                </a-form-item>
                <a-form-item field="expired_time" :label="$t('searchTable.columns.expiredTime')">
                    <a-date-picker v-model="createFormModel.expired_time" style="width: 200px;" />
                </a-form-item>
                </a-form>
              </a-modal>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="handleChange($event, item as TableColumnData, index)"
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
     
        <template #filterType="{ record }">
          {{ $t(`searchTable.form.filterType.${record.filterType}`) }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status === 'offline'" class="circle"></span>
          <span v-else class="circle pass"></span>
          {{ $t(`searchTable.form.status.${record.status}`) }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="handleClickView(record)">
            {{ $t('searchTable.columns.operations.view') }}
          </a-button>
            <a-button type="text" size="small" @click="handleDeleteCache(record)">
            {{ $t('searchTable.columns.operations.delete') }}
          </a-button>
               <a-modal v-model:visible="deleteVisible" :title="$t('searchTable.operation.detele.title')" @ok="handleDeleteOK(record.CarfileCid)" @cancel="handleDeleteCancel">
                {{ $t('searchTable.columns.operations.delete.confirm') }}
              </a-modal>
        </template>
      </a-table>
    </a-card>
  </div>

  
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { queryCacheList, CacheRecord, createCache, CacheParams, CreateCacheParams, deleteCache } from '@/api/cache';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      carfile_cid: '',
    //   createdTime: [],
    //   status: 0,
    };
  };

  const generateCreateFormModel = () :CreateCacheParams => {
    return {
      carfile_cid: '',
      reliability: 0,
      expired_time: ''
    }
  }

  const router = useRouter();
  const { loading, setLoading } = useLoading(true);
  const visible = ref(false);
  const deleteVisible = ref(false);
  const { t } = useI18n();
  const renderData = ref<CacheRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const createFormModel = ref(generateCreateFormModel());
  
  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    current: 1,
    pageSize: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      slotName: 'index',
    },
    {
      title: t('searchTable.columns.carfileCID'),
      dataIndex: 'CarfileCid',
      slotName: 'carfile_cid',
    },
    {
      title: t('searchTable.columns.carfileHash'),
      dataIndex: 'CarfileHash',
    },
    {
      title: t('searchTable.columns.curReliability'),
      dataIndex: 'CurReliability',
    },
    {
      title: t('searchTable.columns.needReliability'),
      dataIndex: 'NeedReliability',
      slotName: 'need_reliability',
    },
    {
      title: t('searchTable.columns.totalSize'),
      dataIndex: 'TotalSize',
    },
    {
      title: t('searchTable.columns.totalBlocks'),
      dataIndex: 'TotalBlocks',
    },
    {
      title: t('searchTable.columns.expiredTime'),
      dataIndex: 'ExpiredTime',
    },
    {
      title: t('searchTable.columns.createdTime'),
      dataIndex: 'CreateTime',
      slotName: 'created_time',
    },
    {
      title: t('searchTable.columns.endTime'),
      dataIndex: 'EndTime',
      slotName: 'end_time',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const contentTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.contentType.img'),
      value: 'img',
    },
    {
      label: t('searchTable.form.contentType.horizontalVideo'),
      value: 'horizontalVideo',
    },
    {
      label: t('searchTable.form.contentType.verticalVideo'),
      value: 'verticalVideo',
    },
  ]);
  const filterTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.filterType.artificial'),
      value: 'artificial',
    },
    {
      label: t('searchTable.form.filterType.rules'),
      value: 'rules',
    },
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.status.online'),
      value: 'online',
    },
    {
      label: t('searchTable.form.status.offline'),
      value: 'offline',
    },
  ]);
  const fetchData = async (
    params: CacheParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryCacheList(params);
      renderData.value = data.list;
      pagination.current = params.current;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    if (formModel.value.carfile_cid === '') {
        fetchData({
        ...basePagination,
        ...formModel.value,
        } as unknown as CacheParams);
    }else{
        console.log(formModel.value.carfile_cid)
    }

  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();

  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const handleClickView = (
    record: any,
  ) => {
    router.push({ name: 'CacheProfile', query: { 'cid': record.CarfileCid }})
  }

  const handleDeleteCache = () => {
    deleteVisible.value = true;
  }

  const handleDeleteOK = async(cid: string) => {
    try {
    const { data } = await deleteCache({'carfile_cid': cid});
    } catch (err) {
    // you can report use errorHandler or other
    } finally {
    setLoading(false);
    }
    fetchData();
  }

  const handleDeleteCancel = () => {
    deleteVisible.value = false;
  }


const handleCreate = () => {
    visible.value = true;
};

const handleSubmitCreate = async () => {
    visible.value = false;
    try {
    const { data } = await createCache(createFormModel.value);
    } catch (err) {
    // you can report use errorHandler or other
    } finally {
    setLoading(false);
    }

    createFormModel.value = generateCreateFormModel();
    fetchData();
};
   
const handleCancel = () => {
    visible.value = false;
}

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
