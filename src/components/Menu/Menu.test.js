import React from 'react';
import { MenuContent, MenuItem, MenuLabel } from '../../components';
import { renderDeep } from '../../util/test-helpers';
import Menu from './Menu';

describe('Menu', () => {
  it('matches snapshot', () => {
    const tree = renderDeep(
      <Menu>
        <MenuLabel>Label</MenuLabel>
        <MenuContent>
          <MenuItem key="1">Menu item 1</MenuItem>
          <MenuItem key="2">Menu item 2</MenuItem>
        </MenuContent>
      </Menu>
    );
    expect(tree).toMatchSnapshot();
  });
});
