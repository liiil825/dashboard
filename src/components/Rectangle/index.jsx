import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AppImages from './AppImages';
import CopyId from '../DetailCard/CopyId';
import styles from './index.scss';

export default class Rectangle extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    apps: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    id: PropTypes.string
  };

  render() {
    const { title, description, apps, total, id } = this.props;

    return (
      <div className={styles.rectangle}>
        <div className={styles.title} title={title}>
          <Link to={`/dashboard/category/${id}`}>{title}</Link>
        </div>
        <CopyId id={id} />
        <div className={styles.description}>{description}</div>
        <AppImages apps={apps} total={total} />
      </div>
    );
  }
}
