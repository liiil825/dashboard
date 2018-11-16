import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { Icon, Button, Input, Upload, Notification } from 'components/Base';
import StepContent from './StepContent';
import Footer from './Footer';
import Card from './Card';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  appStore: rootStore.appStore,
  appCreateStore: rootStore.appCreateStore,
  user: rootStore.user
}))
@observer
export default class AppAdd extends Component {
  async componentDidMount() {
    const { repoStore } = this.props;

    await repoStore.fetchAll({
      noLimit: true
    });
  }

  componentWillUnmount() {
    this.props.appCreateStore.reset();
  }

  renderTopLink() {
    const { t, appCreateStore } = this.props;
    const { createStep, prevStep, goBack } = appCreateStore;
    if (createStep === 4) {
      return null;
    }

    let text = '';
    if (createStep > 1) {
      text = t(`Create_App_Header_TIPS0${createStep}`);
      text = `「${text}」`;
    }

    return (
      <div className={styles.operate}>
        {createStep > 1 && (
          <label onClick={prevStep}>
            ←&nbsp;{t('Back')}&nbsp;
            <span className={styles.operateText}>{text}</span>
          </label>
        )}
        <label className="pull-right" onClick={goBack}>
          {t('Esc')}&nbsp;
          <Icon name="close" size={20} type="dark" />
        </label>
      </div>
    );
  }

  renderSelectDeliveryType() {
    const { appCreateStore } = this.props;
    const { deliveryTypes, createStep } = appCreateStore;
    return (
      <StepContent createStep={createStep} className={styles.createApp}>
        <div className={styles.cardContainer}>
          {deliveryTypes.map(item => (
            <Card key={item.intro} appCreateStore={appCreateStore} {...item} />
          ))}
        </div>
      </StepContent>
    );
  }

  renderUploadConf() {
    const { t, appCreateStore } = this.props;
    const { isLoading, createStep, uploadStatus, errorMessage, checkFile, upload } = appCreateStore;
    const configs = [
      'Chart.yaml',
      'LICENSE',
      'README.md',
      'requirements.yaml',
      'values.yaml',
      'charts/',
      'templates/',
      'templates/NOTES.txt'
    ];

    return (
      <StepContent createStep={createStep} className={styles.createApp}>
        <Upload t={t} checkFile={checkFile} uploadFile={upload}>
          <div
            className={classNames(styles.upload, {
              /* [styles.uploading]: isLoading, */
              [styles.uploadError]: !!errorMessage
            })}
          >
            {!!isLoading && (
              <div className={styles.loading}>
                <Icon name="loading" size={48} type="dark" />
                <p className={styles.note}>{t('file_format_loading')}</p>
              </div>
            )}
            {!isLoading &&
              !errorMessage && (
                <div>
                  <Icon name="upload" size={48} type="dark" />
                  <p className={styles.note}>{t('file_format_note')}</p>
                </div>
              )}
            {errorMessage && (
              <div className={styles.errorNote}>
                <Icon name="error" size={48} />
                {errorMessage}
                「<span className={styles.errorNoteLink}>{t('Upload again')}</span>」
              </div>
            )}
          </div>
        </Upload>

        <ul className={styles.config}>
          {configs.map(config => (
            <li key={config}>
              <span className={styles.configName}>{config}</span>
              <span className={styles.configInfo}># {t(`${config}_Info`)}</span>
            </li>
          ))}
          {uploadStatus === 'init' && <div className={styles.configMask} />}
        </ul>
      </StepContent>
    );
  }

  renderConfirmMsg() {
    const { t, appCreateStore } = this.props;
    const { createStep, appName, appVersion, changeAppName, changeAppVersion } = appCreateStore;

    return (
      <StepContent createStep={createStep} className={styles.createApp}>
        <div className={styles.configMsg}>
          <div>
            <label className={styles.configTitle}>{t('App Name')}</label>
            <Input
              value={appName}
              onChange={changeAppName}
              className={styles.appName}
              name="appName"
              placeholder=""
            />
            <span className={styles.tips}>{t('INPUT_APP_NAME_TIP')}</span>
          </div>
          <div>
            <label className={styles.configTitle}>{t('Current Version')}</label>
            <Input
              value={appVersion}
              onChange={changeAppVersion}
              className={styles.appVersion}
              name="appVersion"
              placeholder=""
            />
            <span className={styles.tips}>{t('INPUT_APP_VERSION_TIP')}</span>
          </div>
          <div>
            <label className={styles.configTitle}>{t('App Icon')}</label>
            <Upload>
              <div className={styles.appIcon}>
                <Icon name="upload" size={24} type="dark" />
              </div>
            </Upload>
            <span className={styles.tips}>{t('INPUT_APP_ICON_TIP')}</span>
          </div>
        </div>
      </StepContent>
    );
  }
  renderSuccessMsg() {
    const { t } = this.props;

    return (
      <div className={styles.successMsg}>
        <Icon className={styles.checkedIcon} name="checked-circle" size={48} />
        <div className={styles.textTip}>{t('Congratulations on you')}</div>
        <div className={styles.textHeader}>{t('Your app has been created successfully')}</div>
        <div className={styles.successBtns}>
          <Button type="primary" onClick={() => {}}>
            {t('Deploy Test')}
          </Button>
          <Button onClick={() => {}} className={styles.addBtn}>
            {t('Add delivery type')}
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const { appCreateStore } = this.props;
    const { createStep } = appCreateStore;

    return (
      <div className={styles.createApp}>
        <div className={classNames(styles['header-step'], styles[`header-step-0${createStep}`])} />
        {this.renderTopLink()}
        {createStep === 1 && this.renderSelectDeliveryType()}
        {createStep === 2 && this.renderUploadConf()}
        {createStep === 3 && this.renderConfirmMsg()}
        {createStep === 4 && this.renderSuccessMsg()}
        <Footer store={appCreateStore} />
        <Notification />
      </div>
    );
  }
}
