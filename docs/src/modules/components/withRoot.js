// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash/find';
import { Provider } from 'react-redux';
import pure from 'recompose/pure';
import wrapDisplayName from 'recompose/wrapDisplayName';
import AppWrapper from 'docs/src/modules/components/AppWrapper';
import initRedux from 'docs/src/modules/redux/initRedux';
import findPages from /* preval */ 'docs/src/modules/utils/findPages';
import { loadCSS } from 'fg-loadcss/src/loadCSS';

if (process.browser) {
  loadCSS(
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    document.querySelector('#insertion-point-jss'),
  );
}

const pages = [
  {
    ...findPages[1],
    title: 'Component Demos',
  },
  {
    ...findPages[0],
    title: 'Component API',
  },
  {
    pathname: '/discover-more',
    children: [
      {
        pathname: '/discover-more/installation',
      },
      {
        pathname: '/discover-more/vision',
      },
      {
        pathname: '/discover-more/community',
      },
      {
        pathname: '/discover-more/showcase',
      },
      {
        pathname: '/discover-more/related-projects',
      },
      {
        pathname: '/discover-more/roadmap',
      },
    ],
  },
  {
    pathname: '/',
    title: false,
  },
];

function findActivePage(currentPages, url) {
  const activePage = find(currentPages, page => {
    if (page.children) {
      return url.pathname.indexOf(page.pathname) !== -1;
    }

    // Should be an exact match if no children
    return url.pathname === page.pathname;
  });

  if (!activePage) {
    return null;
  }

  // We need to drill down
  if (activePage.pathname !== url.pathname) {
    return findActivePage(activePage.children, url);
  }

  return activePage;
}

function withRoot(BaseComponent) {
  // Prevent rerendering
  const PureBaseComponent = pure(BaseComponent);

  type WithRootProps = {
    reduxServerState?: Object,
    sheetsRegistry?: Object,
    url: Object,
  };

  class WithRoot extends React.Component<WithRootProps> {
    static childContextTypes = {
      url: PropTypes.object,
      pages: PropTypes.array,
      activePage: PropTypes.object,
    };

    static getInitialProps(ctx) {
      let initialProps = {};
      const redux = initRedux({});

      if (BaseComponent.getInitialProps) {
        const baseComponentInitialProps = BaseComponent.getInitialProps({ ...ctx, redux });
        initialProps = {
          ...baseComponentInitialProps,
          ...initialProps,
        };
      }

      if (process.browser) {
        return initialProps;
      }

      return {
        ...initialProps,
        // No need to include other initial Redux state because when it
        // initialises on the client-side it'll create it again anyway
        reduxServerState: redux.getState(),
      };
    }

    constructor(props, context) {
      super(props, context);
      this.redux = initRedux(this.props.reduxServerState || {});
    }

    getChildContext() {
      return {
        url: this.props.url ? this.props.url : null,
        pages,
        activePage: findActivePage(pages, this.props.url),
      };
    }

    redux = null;

    render() {
      const { sheetsRegistry, ...other } = this.props;

      return (
        <Provider store={this.redux}>
          <AppWrapper sheetsRegistry={sheetsRegistry}>
            <PureBaseComponent initialProps={other} />
          </AppWrapper>
        </Provider>
      );
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    WithRoot.displayName = wrapDisplayName(BaseComponent, 'withRoot');
  }

  return WithRoot;
}

export default withRoot;
