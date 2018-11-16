import { observable, action } from 'mobx';

import { get, assign } from 'lodash';
import Store from '../Store';

const deliveryTypes = [
  {
    icon: 'vm-icon',
    name: 'VM',
    intro: 'delivery_type_intro_vm',
    introLink: ''
  },
  {
    icon: 'helm-icon',
    name: 'Helm',
    intro: 'delivery_type_intro_helm',
    introLink: ''
  },
  {
    icon: 'saas-icon',
    name: 'SaaS',
    intro: 'delivery_type_intro_saas',
    introLink: ''
  },
  {
    icon: 'api-icon',
    name: 'API',
    intro: 'delivery_type_intro_api',
    introLink: ''
  },
  {
    icon: 'native-icon',
    name: 'Native',
    intro: 'delivery_type_intro_native',
    introLink: ''
  },
  {
    icon: 'serveless-icon',
    name: 'Serveless',
    intro: 'delivery_type_intro_serveless',
    introLink: ''
  }
];

export default class AppCreateStore extends Store {
  @observable createStep = 1;
  @observable isLoading = false;
  @observable selectedType = '';
  @observable deliveryTypes = [];
  @observable uploadStatus = 'init';
  @observable errorMessage = '';
  @observable appName = '';
  @observable appVersion = '';
  @observable appIcon = '';
  @observable createReopId = 'repo-MzNR1rGkGW7l';

  deliveryTypes = deliveryTypes;

  @action
  nextStep = ({ t }) => {
    window.scroll({ top: 0, behavior: 'smooth' });
    if (!this.selectedType) {
      return this.info(t('Please select a delivery type!'));
    }
    this.createStep = this.createStep + 1;
  };

  @action
  prevStep = () => {
    if (this.createStep > 1) {
      this.createStep = this.createStep - 1;
    }
  };

  @action
  goBack = () => {
    this.reset();
    console.log(this.selectedType);
    history.back();
  };

  checkAddedDelivery = name => this.deliveryTypes.toJSON().includes(name);

  reset = () => {
    this.createStep = 1;
    this.errorMessage = '';
    this.selectedType = '';
  };

  @action
  create = async (params = {}) => {
    this.isLoading = true;
    await this.request.post('apps', params);
    this.isLoading = false;
  };

  @action
  modify = async (params = {}) => {
    this.isLoading = true;
    this.createResult = await this.request.patch('apps', params);
    this.isLoading = false;
  };
  @action
  selectDeliveryType = step => {
    if (this.selectedType === step) {
      this.selectedType = '';
    } else {
      this.selectedType = step;
    }
  };
  createReset = () => {
    this.createStep = 1;
  };

  @action
  createOrModify = async (params = {}) => {
    const defaultParams = {
      repo_id: this.createReopId,
      package: this.uploadFile
    };

    if (this.createAppId) {
      defaultParams.app_id = this.createAppId;
      await this.modify(assign(defaultParams, params));
    } else {
      defaultParams.status = 'draft';
      await this.create(assign(defaultParams, params));
    }

    if (get(this.createResult, 'app_id')) {
      this.createAppId = get(this.createResult, 'app_id');
      this.createStep = 3;
      await this.fetchMenuApps();
    } else {
      const { err, errDetail } = this.createResult;
      this.createError = errDetail || err;
    }
  };

  @action
  checkFile = ({ file, t }) => {
    const maxsize = 2 * 1024 * 1024;

    if (!/\.(tar|tar\.gz|tar\.bz|tgz|zip)$/.test(file.name.toLocaleLowerCase())) {
      this.errorMessage = t('file_format_note');
      return false;
    } else if (file.size > maxsize) {
      this.errorMessage = t('The file size cannot exceed 2M');
      return false;
    }

    return true;
  };

  @action
  upload = ({ base64Str, file }) => {
    this.uploadFile = base64Str;
    this.createOrModify();
  };

  @action
  changeAppName = e => {
    this.appName = e.target.value;
  };
  @action
  changeAppVersion = e => {
    this.appVersion = e.target.value;
  };
}
