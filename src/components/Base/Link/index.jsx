import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import links from 'config/doc-link';

@translate()
export default class Loading extends Component {
  static propTypes = {
    to: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    type: '',
    children: null
  };

  render() {
    const { t, to, type, children } = this.props;
    let text = t(`LINK_${type}`);
    const linkTo = to || links[type];
    if (text === `LINK_${type}`) {
      text = linkTo;
    }
    if (!!children) {
      text = children;
    }
    if (!text) {
      return null;
    }
    if (!linkTo) {
      console.error("You should edit a link url in the file of 'config/doc-links'");
    }

    return <Link to={linkTo}>{text}</Link>;
  }
}
