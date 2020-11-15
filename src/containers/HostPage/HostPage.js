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
import MultiColumnSection from './MultiColumnSection';
import TextAndImageSection from './TextAndImageSection';

import css from './HostPage.css';
import hostInfoPic1 from './HostInfoPic1.jpg';
import hostInfoPic2 from './HostInfoPic2.jpg';
import hostInfoPic3 from './HostInfoPic3.jpg';

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
      title="About Hosting"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'HostPage',
        description: 'About Hosting',
        name: 'About Hosting',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.s}>
          <div className={css.heroContainer}>

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
          <div className={css.staticPageWrapper}>
            <MultiColumnSection
              showGraphics={true}
              title={'How Do I Become a Host?'}
              content={[
                {
                  title: '1. List your space for free',
                  content: `Click the button above to begin your hosting journey. If you do not yet have a BubbleLink account you will be redirected to
                  the sign-up page to create your profile. Our easy to use listing form will then guide you through the process of adding your first
                  space and creating your free Stripe account to handle payouts.`,
                },
                {
                  title: '2. Host your way',
                  content: `You decide the price, rules and availability for your space. Manage the availability from your account to suit your schedule.`,
                },
                {
                  title: '3. Start Renting',
                  content: `BubbleLink users can then search for properties like yours and request to book them. You choose which bookings to accept.
                  Message your guests with any questions. BubbleLink charges each guest before their stay and releases your money once the guest has
                   completed their experience. You never have to handle money directly.`,
                },
              ]}
            />
            <TextAndImageSection
              title={'What are the benefits of becoming a host?'}
              subtitle={null}
              content={
                <ul className={css.heroList}>
                  <li>Unlock the earning potential in your space without having to rent it for overnight stays</li>
                  <li>No sign-up or subscription charges</li>
                  <li>Add multiple listings</li>
                  <li>Manage your profile and listings with ease from your account</li>
                  <li>Set the availability of your space to suit your schedule</li>
                  <li>Set your own prices and vary them at your discretion</li>
                  <li>Choose to offer daily and/or hourly bookings</li>
                  <li>Choose to rent the space in its entirety or as individual spaces</li>
                  <li>Message your guests with any questions</li>
                  <li>Set your own ground rules and prerequisites</li>
                  <li>Choose which bookings you want to accept</li>
                </ul>
              }
              image={hostInfoPic3}
              largeImage
            />
            <MultiColumnSection
              showGraphics={false}
              title={'Are there any costs to signing up?'}
              content={[
                {
                  title: 'Answer: No!',
                  content: `There is no charge when you sign-up to BubbleLink and no ongoing subscription fee.
                  Why not sign-up, add a listing and test out the site to see if it's for you?`,
                },
              ]}
            />
            <MultiColumnSection
              showGraphics={false}
              title={'So how does BubbleLink make money?'}
              content={[
                {
                  content: `We strive to be as transparent as possible, so we let you know up front about our 10% fee on booking transactions.
                  This is necessary to cover the costs of providing the platform, including Stripe processing fees, and to help BubbleLink grow. We reinvest
                  in the platform so that our community can enjoy the best possible user experience.`,
                },
                {
                  content: `Once a guest has successfully completed their experience with you we will deduct our fee
                  from the booking cost and pass the remainder on to you.`,
                },
              ]}
            />
            <TextAndImageSection
              title={'What type of space can I offer?'}
              subtitle={'The only limit is your creativity!'}
              content={
                <>
                  <p>
                    From renting out an unused home office, to a cozy sitting room, to a large open
                    plan living space suitable for multiple people to work or have meetings, to a
                    garden space, home gym or home cinema, to a plain ol' empty room, the choices
                    are endless.
                  </p>

                  <p>
                    If it's a space you love why not list it and find out if others love it too?
                  </p>
                </>
              }
              image={hostInfoPic2}
              imageLeft
            />
            <MultiColumnSection
              showGraphics={false}
              title={'Who will rent be renting my space?'}
              subtitle={'Your guests could be anyone. Some examples include:'}
              content={[
                {
                  content: (
                    <ul className={css.heroList}>
                      <li>Remote workers looking for extra space or a break from the home office</li>
                      <li>Professionals (e.g physios, therapists, coaches) looking for spaces close to their clients</li>
                      <li>Students looking for quiet spaces to prepare for exams or to collaborate on projects</li>
                      <li>Teams looking for spaces where they can meet outside of the normal stuffy boardroom</li>
                      <li>Companies looking for a space where they can hold interviews outside the office</li>
                      <li>Start-ups and small businesses looking for flexible spaces without commitments</li>
                      <li>Those looking for that perfect event space to make it a day, evening or night to remember</li>
                      <li>Fitness instructors, yoga teachers and personal trainers looking for spaces where they can hold classes in locations that suit their clients</li>
                      <li>Companies looking for venues for photoshoots and productions</li>
                      <li>And anyone else you can think of!</li>
                    </ul>
                  ),
                },
              ]}
            />
            <TextAndImageSection
              title={'Why choose BubbleLink?'}
              subtitle={null}
              content={
                <ul className={css.heroList}>
                  <li>Our platform is easy to use with no hidden costs</li>
                  <li>We are committed to consistently improving our platform</li>
                  <li>We do not advertise on the site</li>
                  <li>You will have access to a growing network of users</li>
                  <li>We are on hand to support you with any queries</li>
                  <li>We are working hard on bringing new features and offerings to our hosts and guests</li>
                </ul>
              }
              image={hostInfoPic1}
              smallImage
            />
            {/* <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>How do I become a Host?</p>
              </div>

              <div className={css.contentMain}>
                <h4>
                  Click the "+Become a Host" button above to create your free account. Our easy to
                  use listing form will then guide you through the process of adding your first
                  space.
                </h4>
              </div>
            </div>

            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>What are the benefits to becoming a Host?</p>
              </div>
              <div className={css.contentMain}>
                <ul>
                  <li> Unlock the earning potential in your space</li>
                  <li>Easily manage your profile and listings from your personal account</li>
                  <li>Adjust the availability of your space to suit your schedule</li>
                  <li>Set your own prices</li>
                  <li>Choose whether to offer your space for daily or hourly bookings</li>
                  <li>
                    Use the built in chat function to arrange handover of the space with your guest
                  </li>
                </ul>
              </div>
            </div>
            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>Are there any costs to signing up?</p>
              </div>
              <div className={css.contentMain}>
                <h4>
                  There is no subscription cost when you sign-up to BubbleLink. You only pay a fee
                  once your space has been booked.
                </h4>
                <h4> Why not sign-up and test out the site to see if it's for you? </h4>
              </div>
            </div>

            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>What fees do BubbleLink take on each booking?</p>
              </div>
              <div className={css.contentMain}>
                <h4>
                  Once a guest has successfully completed their experience we will deduct 10% from
                  the booking cost to cover our expenses incurred in providing the platform and the
                  payment system and pass the remainder on to you.
                </h4>
              </div>
            </div>

            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>What type of space can I offer?</p>
              </div>
              <div className={css.contentMain}>
                <h4>The choices are limited only by your imagination! </h4>
                <h4>
                  {' '}
                  From renting out an unused home office, to a cozy sitting room, to a large open
                  plan living space suitable for multiple people to work or have meetings, to a
                  garden space, home gym or home cinema, to a plain ol' empty room, the choices are
                  endless.{' '}
                </h4>
                <h4>
                  If it's a space you love why not list it and find out if others love it too.{' '}
                </h4>
              </div>
            </div>

            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>Who will rent my space?</p>
              </div>
              <div className={css.contentMain}>
                <ul>
                  <li>
                    Remote workers stuck in unsuitable conditions are looking for inspiring places
                    to work and network
                  </li>
                  <li>
                    Professionals like physios and therapists are looking for spaces close to their
                    clients so that they can increase the numbers they see in a day
                  </li>
                  <li>Students are looking for quiet spaces to prepare for exams</li>
                  <li>
                    Teams are looking for spaces where they can meet outside of the normal stuffy
                    boardroom
                  </li>
                  <li>
                    Those planning events are looking for that unique space to make it a day,
                    evening or night to remember
                  </li>
                  <li>
                    Fitness instructors such as yoga teachers and personal trainers are looking for
                    spaces where they can hold classes in locations that suit their clients
                  </li>
                  <li>Interviews, photoshoots,</li>
                </ul>
              </div>
            </div> */}
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
