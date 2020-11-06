import React from 'react';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import { updateProfile } from '../../containers/ProfileSettingsPage/ProfileSettingsPage.duck';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
  SectionHostHero,
} from '../../components';
import MultiColumnSection from './MultiColumnSectionAbout';
import TextAndImageSection from './TextAndImageSectionAbout';

import css from './AboutPage.css';
import aboutUsPic1 from './AboutUsPic1.jpg';
import aboutUsPic2 from './AboutUsPic2.jpg';

const HostPageComponent = props => {
  const {
    history,
    location,
    isAuthenticated,
    currentUser,
    currentUserIsHost,
    currentUserHasListings,
    becomeHost,
  } = props;
  console.log(props);
const isHost = isAuthenticated && currentUser?.attribute?.profile?.publicData?.isHost
  // prettier-ignore
  return (
    <StaticPage
      title="About BubbleLink"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'AboutPage',
        description: 'About BubbleLink',
        name: 'About BubbleLink',
      }}
    >
      <LayoutSingleColumn>
      <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.s}>
          <div className={css.staticPageWrapper}>

            <TextAndImageSection
              title={'About BubbleLink'}
              subtitle={null}
              content={

                <p className={css.heroList}>
                  We strive to build a community where our hosts can connect their guests with that perfect space.
                  Whatever type of space you can think of, we want BubbleLink to be the bridge that connects hosts and guests.<br/>
                  <br/>
                  Whether it's somewhere to work remotely, to hold a meeting with your team or with clients, to collaborate
                  on college projects, a quiet place to prepare for exams or somewhere to hold a unique event, we want BubbleLink
                  to be your go to place for all your space needs.
                  </p>
              }
              image={aboutUsPic1}
              largeImage
            />

            <MultiColumnSection
              showGraphics={false}
              title={'The BubbleLink concept'}
              content={[
                {
                  content: `With the impact of Covid-19 bringing the travel industry to its knees, and the explosion in remote working as a result, we at BubbleLink
                            saw an urgent need to reimagine how we host and work. We wanted to help hosts who may traditionally have used their spaces for short-term
                            rentals to unlock new revenue streams and to take remote workers out of cramped bedrooms and kitchen tables into ideal working spaces.`,
                },
                {
                  content: `But then we thought, why stop there?`,
                },
                {
                 content: `We discovered that there were so many amazing spaces that had never been used for short-term rentals which were ideal for daily letting.
                 Beautiful homes, grand old buildings, wonderful gardens...all of which we wanted to help our hosts share with the world.`,
                 },
              ]}
            />
            <TextAndImageSection
              title={'A message from our Founder'}
              subtitle={''}
              content={
                <>
                  <p>
                   <i> "When Covid-19 hit I found myself working at home for the first time at a cramped kitchen table
                   with a wobbly chair. The building in which I lived was full of empty apartments that had been used for short-term rentals,
                   a market that disappeared overnight. I thought, wouldn't it be so much better for both parties if the space could be used
                   for day time letting and remote working. When I couldn't find a website that offered this service I decided to create my own."<br/>
                   <br/>
                   "However, after some research, I quickly realised the idea went far beyond remote working spaces. There were so many diverse spaces with
                    myriad uses that hosts wanted to share with the world but just needed the right platform to do so. And so BubbleLink was formed!"
                   </i>
                  </p>
                  <br />
                  <p>
                    <b> Brendan | Founder of BubbleLink </b>
                  </p>
                </>
              }
              image={aboutUsPic2}
              imageLeft
            />
          </div>
       </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

const mapDispatchToProps = dispatch => ({
  becomeHost: data => dispatch(updateProfile(data)),
});
const mapStateToProps = state => {
  const { currentUser, currentUserHasListings, currentUserIsHost } = state.user;
  console.log(state.user)
  const {isAuthenticated} = state.Auth
  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    currentUserIsHost,
    currentUserHasListings,
    isAuthenticated,
  };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671

const HostPage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(HostPageComponent);

export default HostPage;
