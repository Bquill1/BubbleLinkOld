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
{/*          <div className={css.heroContainer}>

          <SectionHostHero
            className={css.hero}
            history={history}
            location={location}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            isHost={currentUserIsHost}
            currentUserHasListings={currentUserHasListings}
            becomeHost={becomeHost}
          />

          </div>
*/}
          <div className={css.staticPageWrapper}>
      {/*      <MultiColumnSection
              showGraphics={true}
              title={'How Do I Become a Host?'}
              content={[
                {
                  title: '1. Sign Up For Free',
                  content: `Click the "+Become a Host" button above to create your free account.`,
                },
                {
                  title: '2. Create Your Listing',
                  content: `Our easy to use listing form will then guide you through the process of adding your first space.`,
                },
                {
                  title: '3. Start Renting!',
                  content: `The BubbleLink users can then search for properties like yours, book them, and the money goes straight to you!`,
                },
              ]}
            />
            */}
            <TextAndImageSection
              title={'About Bubblelink'}
              subtitle={null}
              content={

                <p className={css.heroList}>
                  We strive to build a community where our hosts can connect their guests with that perfect space. <br/>
                  Whether it's somewhere to work remotely, to hold a meeting with your team or with clients, to collaborate
                  on college projects, a quiet place to prepare for exams or somewhere to hold a unique event, we want BubbleLink
                  to be your go to place for all your space needs.
                  </p>



              }
              image={aboutUsPic1}
              largeImage
            />
 {/*           <MultiColumnSection
              showGraphics={false}
              title={'The BubbleLink concept'}
              content={[
                {
                  title: 'Answer: No!',
                  content: `There is no subscription cost when you sign-up to BubbleLink. You only pay a fee once your space has been booked.
Why not sign-up and test out the site to see if it's for you?`,
                },
              ]}
            />
  */}
            <MultiColumnSection
              showGraphics={false}
              title={'The BubbleLink concept'}
              content={[
                {
                  content: `With the impact of Covid-19 bringing the travel industry to its knees, and the explosion in remote working as a result, we at BubbleLink
                            saw an urgent need to reimagine how we host and work. We wanted to help hosts who may have traditionally used their spaces for short-term
                            rentals to unlock new revenue streams and to take remote workers out of cramped bedrooms and kitchen tables into ideal working spaces.`,
                },
                {
                  content: `But then we thought, why stop there?`,
                },
                {
                 content: `We discovered that there were so many amazing spaces that had never been used for short-term rentals which were ideal for daily letting.
                 Beautiful homes, grand old buildings, wonderful gardens...all of which we wanted to help our hosts share with the world  `,
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
                   a market that had suddenly disappeared. I thought, wouldn't it be so much better for both parties if the space could be used
                   for day time letting and remote working"
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
