import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { filter, get, orderBy } from 'lodash';

import { Icon, Button, Table, Popover, Select, Modal } from 'components/Base';
import Status from 'components/Status';
import Toolbar from 'components/Toolbar';
import TdName, { ProviderName } from 'components/TdName';
import Statistics from 'components/Statistics';
import Layout, { Dialog, Grid, Row, Section, Card } from 'components/Layout';
import { getSessInfo, getObjName } from 'utils';
import TimeShow from 'components/TimeShow';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sessInfo }) => ({
  rootStore,
  appStore: rootStore.appStore,
  categoryStore: rootStore.categoryStore,
  repoStore: rootStore.repoStore,
  sessInfo
}))
@observer
export default class Apps extends Component {
  static async onEnter({ appStore, categoryStore, repoStore }) {
    await appStore.fetchAll();
    await appStore.appStatistics();
    await repoStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });
    await categoryStore.fetchAll();
  }

  constructor(props) {
    super(props);
    const { appStore, repoStore, sessInfo } = this.props;
    appStore.loadPageInit();
    repoStore.loadPageInit();
    this.role = getSessInfo('role', sessInfo);
  }

  onChangeSort = (params = {}) => {
    const { appStore } = this.props;
    const order = params.reverse ? 'asc' : 'desc';
    appStore.apps = orderBy(appStore.apps, params.sort_key, order);
  };

  renderDeleteModal = () => {
    const { appStore, t } = this.props;
    const { isDeleteOpen, remove, hideModal } = appStore;

    return (
      <Dialog title={t('Delete App')} visible={isDeleteOpen} onSubmit={remove} onCancel={hideModal}>
        {t('Delete App desc')}
      </Dialog>
    );
  };

  renderOpsModal = () => {
    const { appStore, categoryStore, t } = this.props;
    const { isModalOpen, hideModal, handleApp, changeAppCate, modifyCategoryById } = appStore;
    const categories = categoryStore.categories.toJSON();

    const { selectedCategory } = handleApp;

    return (
      <Modal
        title={t('Modify App Category')}
        visible={isModalOpen}
        onCancel={hideModal}
        onOk={modifyCategoryById}
      >
        <div className="formContent">
          <div className="inputItem selectItem">
            <label>{t('Category')}</label>
            <Select value={selectedCategory} onChange={changeAppCate}>
              {categories.map(({ category_id, name }) => (
                <Select.Option
                  key={category_id}
                  value={category_id}
                  isSelected={category_id === selectedCategory}
                >
                  {name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    );
  };

  renderHandleMenu = item => {
    const { t } = this.props;
    const { showDeleteApp, showModifyAppCate } = this.props.appStore;
    let itemMenu = null,
      deployEntry = null;

    if (item.status !== 'deleted') {
      deployEntry = <Link to={`/dashboard/app/${item.app_id}/deploy`}>{t('Deploy App')}</Link>;
      if (this.role === 'developer') {
        itemMenu = (
          <Fragment>
            <span onClick={showDeleteApp.bind(null, item.app_id)}>{t('Delete App')}</span>
          </Fragment>
        );
      }
      if (this.role === 'admin') {
        itemMenu = (
          <Fragment>
            <span onClick={showDeleteApp.bind(null, item.app_id)}>{t('Delete App')}</span>
            <span onClick={showModifyAppCate.bind(null, item.app_id, item.category_set)}>
              {t('Modify category')}
            </span>
          </Fragment>
        );
      }
    }

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/app/${item.app_id}`}>{t('View detail')}</Link>
        {deployEntry}
        {itemMenu}
      </div>
    );
  };

  renderToolbar() {
    const { t } = this.props;
    const {
      searchWord,
      onSearch,
      onClearSearch,
      onRefresh,
      showDeleteApp,
      appIds
    } = this.props.appStore;

    if (appIds.length) {
      return (
        <Toolbar>
          <Button type="delete" onClick={() => showDeleteApp(appIds)} className="btn-handle">
            {t('Delete')}
          </Button>
        </Toolbar>
      );
    }

    return (
      <Toolbar
        placeholder={t('Search App')}
        searchWord={searchWord}
        onSearch={onSearch}
        onClear={onClearSearch}
        onRefresh={onRefresh}
      />
    );
  }

  render() {
    const { appStore, repoStore, t } = this.props;
    const {
      apps,
      summaryInfo,
      totalCount,
      isLoading,
      currentPage,
      changePagination,
      selectedRowKeys,
      onChangeSelect,
      onChangeStatus,
      selectStatus
    } = appStore;

    const { repos } = repoStore;

    const columns = [
      {
        title: t('App Name'),
        key: 'name',
        width: '190px',
        render: item => (
          <TdName
            name={item.name}
            description={item.app_id}
            image={item.icon || 'appcenter'}
            linkUrl={`/dashboard/app/${item.app_id}`}
          />
        )
      },
      {
        title: t('Latest Version'),
        key: 'latest_version',
        width: '120px',
        render: item => get(item, 'latest_app_version.name', '')
      },
      {
        title: t('Status'),
        key: 'status',
        width: '90px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('Categories'),
        key: 'category',
        width: '150px',
        render: item =>
          t(
            get(item, 'category_set', [])
              .filter(cate => cate.category_id && cate.status === 'enabled')
              .map(cate => cate.name)
              .join(', ')
          )
      },
      {
        title: t('Visibility'),
        key: 'visibility',
        render: item => t(getObjName(repos, 'repo_id', item.repo_id, 'visibility'))
      },
      {
        title: t('Repo'),
        key: 'repo_id',
        render: item => (
          <Link to={`/dashboard/repo/${item.repo_id}`}>
            <ProviderName
              name={getObjName(repos, 'repo_id', item.repo_id, 'name')}
              provider={getObjName(repos, 'repo_id', item.repo_id, 'providers[0]')}
            />
          </Link>
        )
      },
      {
        title: t('Developer'),
        key: 'owner',
        render: item => item.owner
      },
      {
        title: t('Updated At'),
        key: 'status_time',
        width: '108px',
        sorter: true,
        onChangeSort: this.onChangeSort,
        render: item => <TimeShow time={item.status_time} />
      },
      {
        title: t('Actions'),
        key: 'actions',
        width: '84px',
        render: item => (
          <div className={styles.actions}>
            <Popover content={this.renderHandleMenu(item)} className="actions">
              <Icon name="more" />
            </Popover>
          </div>
        )
      }
    ];

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys: selectedRowKeys,
      onChange: onChangeSelect
    };

    const filterList = [
      {
        key: 'status',
        conditions: [
          { name: t('Active'), value: 'active' },
          { name: t('Deleted'), value: 'deleted' }
        ],
        onChangeFilter: onChangeStatus,
        selectValue: selectStatus
      }
    ];

    const pagination = {
      tableType: 'Apps',
      onChange: changePagination,
      total: totalCount,
      current: currentPage,
      noCancel: false
    };

    return (
      <Layout>
        <Row>
          <Statistics {...summaryInfo} objs={repos.slice()} />
        </Row>

        <Row>
          <Grid>
            <Section size={12}>
              <Card>
                {this.renderToolbar()}
                <Table
                  columns={columns}
                  dataSource={apps.slice(0, 10)}
                  rowSelection={rowSelection}
                  isLoading={isLoading}
                  filterList={filterList}
                  pagination={pagination}
                />
              </Card>
              {this.renderOpsModal()}
              {this.renderDeleteModal()}
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  }
}
