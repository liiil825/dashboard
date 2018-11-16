import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { getPastTime } from 'src/utils';
import styles from './index.scss';
import Status from 'components/Status';

export default class Loading extends Component {
  render() {
    const { data, t } = this.props;
    const { icon, name, description, status, status_time } = data;
    const deliverTypes = ['VM', 'API', 'Helm'];
    return (
      <div className={styles.container}>
        <div className={styles.title}>
          <img className={styles.icon} src={icon || ''} alt="logo" />
          <div>
            <span className={styles.name}>{name}</span>
            <Status className={styles.status} name={status} type={status} />
          </div>
        </div>
        <div className={styles.description}>{description}</div>
        <div className={styles.deliverTypes}>
          <span>{t('Delivery type')}：</span>
          {deliverTypes.map(type => (
            <span key={type} className={styles.deliverType}>
              {type}
            </span>
          ))}
        </div>
        <div>
          <span>{t('Updated At')}：</span>
          <span>{getPastTime(status_time)}</span>
        </div>
      </div>
    );
  }
}
