import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
} from '../../components';
import classNames from 'classnames';
import { NamedLink } from '../../components';

import css from './BlogPage.css';


const BlogPage = () => {
  // prettier-ignore

  return (
    <StaticPage>
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>


        <LayoutWrapperMain className={css.mainWrapper}>
          <h1>
          <FormattedMessage id="BlogPage.title" />
          </h1>


        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );

};

export default BlogPage;
