import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';

import styles from './index.scss';

@translate()
@observer
export default class CreateAppCard extends Component {
  static propTypes = {
    appCreateStore: PropTypes.object,
    name: PropTypes.string,
    intro: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const { name, icon, intro, introLink, className, t, appCreateStore } = this.props;
    const { selectDeliveryType, selectedType, checkAddedDelivery } = appCreateStore;
    const isAdded = checkAddedDelivery(name);

    return (
      <div
        onClick={() => selectDeliveryType(name)}
        className={classNames(styles.container, className, {
          [styles.addedContainer]: isAdded
        })}
      >
        {isAdded && <span className={styles.addedType}>{t('Added')} </span>}
        {name === selectedType && (
          <Icon className={styles.checkedIcon} name="checked-circle" size={20} />
        )}
        <Icon name={icon} size={48} className={styles.icon} type={'light'} />
        <div className={styles.name}>{name}</div>
        <div className={styles.intro}>{t(intro)}</div>
        <Link to={introLink}>
          {t('Linkto_Intro_App')}
          <Icon className={styles.linkIcon} name="next-icon" type="light" size={20} />
        </Link>
      </div>
    );
  }
}
