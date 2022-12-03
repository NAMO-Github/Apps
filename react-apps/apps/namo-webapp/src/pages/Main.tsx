import NetworkChangeAlert from '@components/NetworkChangeAlert';
import PrivateRoute from '@components/Route/PrivateRoute';
import ScrollToTop from '@components/ScrollToTop';
import {
  DETAIL_NFT_ROUTES,
  MY_NFT_ROUTES,
  PROFILE_ROUTES,
  ROUTES,
} from '@constants/routes';

import { useAuth } from '@context/auth';
import { FilterSearchContext } from '@context/filter-search';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import Loading from '@namo-workspace/ui/Loading';
import { MESSAGE } from '@namo-workspace/utils';
import nprogress from 'nprogress';
import { lazy, Suspense, useContext, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import AppLayout from '../layout/App.layout';

const Home = lazy(() => import('./home/Home'));
const LoginPage = lazy(() => import('./login'));
const MyNftPage = lazy(() => import('./my-nft'));
const ProfilePage = lazy(() => import('./profile'));
const ProfilePublic = lazy(() => import('./profile/ProfilePublic'));
const DetailNftPage = lazy(() => import('./public-nft/DetailNftPage'));

const SetNftForRentPage = lazy(() => import('./my-nft/SetNftForRentPage'));
const RentNft = lazy(() => import('@containers/public-nft/RentNft'));
const OrderDetail = lazy(() => import('@containers/order/OrderDetail'));
const EditRentingConfig = lazy(() => import('./my-nft/EditRentingConfig'));

const ForRent = lazy(() => import('@containers/profile/components/ForRent'));
const Gallery = lazy(() => import('@containers/profile/components/Gallery'));
const MyOrder = lazy(() => import('@containers/profile/components/MyOrder'));
const Rentals = lazy(() => import('@containers/profile/components/Rentals'));

const AboutUs = lazy(() => import('./explore/AboutUs'));
const Terms = lazy(() => import('./explore/Terms'));
const FAQ = lazy(() => import('./explore/FAQ'));
const HelpCentre = lazy(() => import('./explore/HelpCentre'));

const Main = () => {
  const { isLoggedIn } = useAuth();
  const { setIsFilterHome } = useContext(FilterSearchContext);
  const isDesktop = useMediaQuery(QUERY.DESKTOP);

  const { key } = useLocation();

  useEffect(() => {
    if (!isDesktop) {
      setIsFilterHome(false);
    }
  }, [isDesktop, setIsFilterHome]);

  useEffect(() => {
    nprogress.start();
    nprogress.done();
  }, [key]);

  return (
    <AppLayout>
      <NetworkChangeAlertS message={MESSAGE.MS001} />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />}>
            <Route
              index
              element={<Navigate to={PROFILE_ROUTES.FOR_RENT} replace />}
            />
            <Route path={PROFILE_ROUTES.FOR_RENT} element={<ForRent />} />
            <Route path={PROFILE_ROUTES.RENTALS} element={<Rentals />} />
            <Route path={PROFILE_ROUTES.GALLERY} element={<Gallery />} />
            <Route path={PROFILE_ROUTES.ORDERS} element={<MyOrder />} />
            <Route
              path="*"
              element={<Navigate to={PROFILE_ROUTES.FOR_RENT} replace />}
            />
          </Route>
          <Route
            path={`${ROUTES.PROFILE_PUBLIC}/:address`}
            element={<ProfilePublic />}
          >
            <Route
              index
              element={<Navigate to={PROFILE_ROUTES.FOR_RENT} replace />}
            />
            <Route path={PROFILE_ROUTES.FOR_RENT} element={<ForRent />} />
            <Route path={PROFILE_ROUTES.RENTALS} element={<Rentals />} />

            <Route
              path="*"
              element={<Navigate to={PROFILE_ROUTES.FOR_RENT} replace />}
            />
          </Route>
          <Route path={`${ROUTES.NFT}/:tokenAddress/:tokenId`}>
            <Route
              index
              element={
                <ScrollToTop>
                  <DetailNftPage />
                </ScrollToTop>
              }
            />
            <Route
              path={`${DETAIL_NFT_ROUTES.RENTING}/:packageId`}
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <ScrollToTop>
                    <RentNft />
                  </ScrollToTop>
                </PrivateRoute>
              }
            />
          </Route>

          <Route
            path={ROUTES.MY_NFT}
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ScrollToTop>
                  <MyNftPage />
                </ScrollToTop>
              </PrivateRoute>
            }
          >
            <Route path={MY_NFT_ROUTES.DETAIL}>
              {/* <Route index element={<DetailNftPage />} /> */}
              <Route
                path={MY_NFT_ROUTES.SET_FOR_RENT}
                element={<SetNftForRentPage />}
              />
              <Route
                path={MY_NFT_ROUTES.EDIT_RENTING_CONFIG}
                element={<EditRentingConfig />}
              />
            </Route>
          </Route>

          <Route
            path={`${ROUTES.ORDER}/:txHash`}
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ScrollToTop>
                  <OrderDetail />
                </ScrollToTop>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ABOUT_US}
            element={
              <ScrollToTop>
                <AboutUs />
              </ScrollToTop>
            }
          />
          <Route
            path={ROUTES.TERMS}
            element={
              <ScrollToTop>
                <Terms />
              </ScrollToTop>
            }
          />
          <Route
            path={ROUTES.FAQ}
            element={
              <ScrollToTop>
                <FAQ />
              </ScrollToTop>
            }
          />
          <Route
            path={ROUTES.HELP_CENTRE}
            element={
              <ScrollToTop>
                <HelpCentre />
              </ScrollToTop>
            }
          />

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
};

const NetworkChangeAlertS = styled(NetworkChangeAlert)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

export default Main;
