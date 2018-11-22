import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import _ from 'lodash';

import Icon from '../Icon';

import styles from './index.scss';

@observer
export default class Input extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    icon: PropTypes.string,
    iconType: PropTypes.string,
    iconSize: PropTypes.number,
    valueChange: PropTypes.func,
    disabled: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    icon: '',
    iconType: 'light',
    iconSize: 16,
    valueChange: _.noop,
    onChange: _.noop,
    disabled: false
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.props.valueChange(name, value);
    this.props.onChange(event);
  }

  render() {
    const { className, icon, iconType, iconSize, onChange, valueChange, ...rest } = this.props;

    if (icon) {
      return (
        <div className={classnames(styles.inputGroup, className)}>
          <Icon name={icon} type={iconType} size={iconSize} />
          <input className={styles.input} onChange={this.onChange} {...rest} />
        </div>
      );
    }

    return (
      <input className={classnames(styles.input, className)} onChange={this.onChange} {...rest} />
    );
  }
}
