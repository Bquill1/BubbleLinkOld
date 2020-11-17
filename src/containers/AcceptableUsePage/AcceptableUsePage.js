import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import { TopbarContainer } from '../../containers';
import {
  Page,
  LayoutSideNavigation,
  LayoutWrapperMain,
  LayoutWrapperSideNav,
  LayoutWrapperTopbar,
  LayoutWrapperFooter,
  Footer,
  AcceptableUse,
} from '../../components';
import config from '../../config';

import css from './AcceptableUsePage.css';

const AcceptableUsePageComponent = props => {
  const { scrollingDisabled, intl } = props;

  const tabs = [
        {
          text: intl.formatMessage({ id: 'AcceptableUsePage.tosTabTitle' }),
          selected: false,
          linkProps: {
            name: 'TermsOfServicePage',
          },
        },
    {
      text: intl.formatMessage({ id: 'AcceptableUsePage.privacyTabTitle' }),
      selected: false,
      linkProps: {
        name: 'PrivacyPolicyPage',
      },
    },
    {
      text: intl.formatMessage({ id: 'AcceptableUsePage.acceptableTabTitle' }),
      selected: true,
      linkProps: {
        name: 'AcceptableUsePage',
      },
    },

  ];
  const siteTitle = config.siteTitle;
  const schemaTitle = intl.formatMessage({ id: 'AcceptableUsePage.schemaTitle' }, { siteTitle });
  const schema = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    name: schemaTitle,
  };
  return (
    <Page title={schemaTitle} scrollingDisabled={scrollingDisabled} schema={schema}>
      <LayoutSideNavigation>
        <LayoutWrapperTopbar>
          <TopbarContainer currentPage="AcceptableUsePage" />
        </LayoutWrapperTopbar>
        <LayoutWrapperSideNav tabs={tabs} />
        <LayoutWrapperMain>
          <div className={css.content}>
            <h1 className={css.heading}>
              <FormattedMessage id="AcceptableUsePage.heading" />
            </h1>
            <AcceptableUse />
          </div>
        </LayoutWrapperMain>
        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSideNavigation>
    </Page>
  );
};

const { bool } = PropTypes;

AcceptableUsePageComponent.propTypes = {
  scrollingDisabled: bool.isRequired,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  return {
    scrollingDisabled: isScrollingDisabled(state),
  };
};

const AcceptableUsePage = compose(
  connect(mapStateToProps),
  injectIntl
)(AcceptableUsePageComponent);

export default AcceptableUsePage;
