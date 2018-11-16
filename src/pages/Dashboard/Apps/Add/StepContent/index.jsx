import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import styles from './index.scss';

@translate()
export default class StepContent extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    explain: PropTypes.string,
    createStep: PropTypes.number,
    children: PropTypes.node
  };

  render() {
    const { createStep, name, explain, t, children, className } = this.props;
    let header = name;
    let info = explain;
    if (!header) {
      header = t('CREAT_NEW_APP_HEADER', {
        createStep,
        totalStep: 3
      });
    }
    if (!info) {
      info = t(`CREATE_APP_HEADER_TIPS0${createStep}`);
    }

    return (
      <div className={classNames(styles.stepContent, className)}>
        <div className={styles.stepName}>{header}</div>
        <div className={styles.stepExplain}>{info}</div>
        {children}
      </div>
    );
  }
}
