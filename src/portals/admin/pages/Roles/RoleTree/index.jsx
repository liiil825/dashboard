import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { Tree } from 'components/Base';

import Item from './item';

import styles from './index.scss';

@translate()
@observer
export default class RoleTree extends Component {
  getTreeData({ roleStore, modalStore }) {
    const { t } = this.props;
    const normalPortal = ['user', 'isv'];
    const adminRoles = roleStore.roles.filter(
      ({ portal }) => portal === 'admin'
    );
    const normalRoles = roleStore.roles.filter(
      ({ portal, owner_path }) => normalPortal.includes(portal) && owner_path === ':system'
    );
    const navData = [
      {
        title: t('Admin Role Title Count', {
          count: adminRoles.length
        }),
        key: 'admin_role',
        disabled: true
      },
      {
        title: t('Normal Role Title Count', {
          count: normalRoles.length
        }),
        key: 'not_admin_role',
        disabled: true
      }
    ];
    navData[0].children = adminRoles.map(role => ({
      key: role.role_id,
      title: (
        <Item
          isAdmin
          key={`title_${role.role_id}`}
          title={role.role_name}
          description={role.description}
          portal={role.portal}
          roleStore={roleStore}
        />
      )
    }));
    navData[0].children.push({
      key: 'create_role',
      disabled: true,
      title: (
        <Item
          type="create_btn"
          key={`title_create_role`}
          title="自定义"
          roleStore={roleStore}
          modalStore={modalStore}
        />
      )
    });
    navData[1].children = normalRoles.map(role => ({
      key: role.role_id,
      title: (
        <Item
          key={`title_${role.role_id}`}
          title={role.role_name}
          description={role.description}
          portal={role.portal}
          roleStore={roleStore}
        />
      )
    }));
    return navData;
  }

  render() {
    const { roleStore, modalStore } = this.props;
    const { onSelectRole, selectedRoleKeys } = roleStore;
    return (
      <div>
        <Tree
          hoverLine
          defaultExpandAll
          selectable
          keyName="role_id"
          onSelect={onSelectRole}
          selectedKeys={selectedRoleKeys}
          className={styles.tree}
          treeData={this.getTreeData({ roleStore, modalStore })}
        />
      </div>
    );
  }
}
