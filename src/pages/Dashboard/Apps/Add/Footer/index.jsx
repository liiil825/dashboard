import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import { Icon, Button } from 'components/Base';

import styles from './index.scss';

@translate()
@observer
export default class CreateAppFooter extends Component {
  static propTypes = {
    store: PropTypes.object
  };

  render() {
    const { t, store } = this.props;
    const { createStep, selectedType, nextStep } = store;
    if (createStep === 4) {
      return null;
    }
    const tipText = t(`Create_App_TIPS0${createStep}`);
    let tipLink = null;
    if (createStep === 2) {
      tipLink = <Link to="">{`${t('Create_App_TIPS02_Link')}。`}</Link>;
    }
    const buttonText = t(`Create_App_Button_Next_0${createStep}`);

    return (
      <div className={styles.footer}>
        <span className={styles.footerTips}>
          <span className={styles.footerTipsButton}>{t('Tips')}</span>
          {tipText}
          {tipLink}
        </span>
        <button
          className={classNames(styles.button, {
            [styles.buttonActived]: !!selectedType
          })}
          type="primary"
          onClick={() => nextStep({ t })}
        >
          {createStep === 4 && <Icon className={styles.icon} name="checked-icon" size={20} />}
          <span>{buttonText}</span>
          {createStep !== 4 && <Icon className={styles.icon} name="next-icon" size={20} />}
        </button>
      </div>
    );
  }
}
