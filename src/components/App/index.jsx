import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromOfflinePlayable from '../../ducks/offlinePlayable';
import * as fromOnlinePlayable from '../../ducks/onlinePlayable';
import * as fromFallbackPlayable from '../../ducks/fallbackPlayable';
import * as fromCurrentFile from '../../ducks/currentFile';
import Blocking from '../Blocking';
import AppError from './AppError';
import Player from '../Player';

class App extends Component {
  componentDidMount() {
    const {
      fetchFallbackPlayable,
      fetchOfflinePlayable,
      fetchOnlinePlayable,
      setAppBlocking,
      setCurrentFile,
    } = this.props;
    Promise.all([
      fetchOfflinePlayable(),
      fetchOnlinePlayable(),
    ])
      .then(
        () => {
          const onlinePlayableFile = fromOnlinePlayable.getOnlinePlayableFile();
          if (onlinePlayableFile === null) {
            fetchFallbackPlayable()
              .then(
                () => {
                  const fallbackPlayableFile = fromFallbackPlayable.getFallbackPlayableFile();
                  setCurrentFile(fallbackPlayableFile);
                  setAppBlocking(false);
                },
                (error) => {
                  setAppBlocking(false);
                  if (process.env.NODE_ENV !== 'production'
                    && error.name !== 'ServerException') {
                    window.console.log(error);
                    return;
                  }
                }
              );
            return;
          }
          setCurrentFile(onlinePlayableFile);
          setAppBlocking(false);
        },
        (error) => {
          // TODO: REFACTOR FOR OFFLINE MODE
          setAppBlocking(false);
          if (process.env.NODE_ENV !== 'production'
            && error.name !== 'ServerException') {
            window.console.log(error);
            return;
          }
        }
      );
  }
  render() {
    const { currentFile } = this.props;
    const {
      appBlocking,
      fetchFallbackPlayableErrorMessage,
      fetchOfflinePlayableErrorMessage,
      fetchOnlinePlayableErrorMessage,
    } = this.props;
    if (appBlocking) return <Blocking />;
    if (
      fetchFallbackPlayableErrorMessage !== null
      || fetchOfflinePlayableErrorMessage !== null
      || fetchOnlinePlayableErrorMessage !== null
    ) return <AppError />;
    return (
      <Player
        currentFile={currentFile}
      />
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  currentFile: PropTypes.string,
  fetchFallbackPlayable: PropTypes.func.isRequired,
  fetchOfflinePlayable: PropTypes.func.isRequired,
  fetchOnlinePlayable: PropTypes.func.isRequired,
  fetchFallbackPlayableErrorMessage: PropTypes.string,
  fetchOfflinePlayableErrorMessage: PropTypes.string,
  fetchOnlinePlayableErrorMessage: PropTypes.string,
  setAppBlocking: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    currentFile: fromCurrentFile.getCurrentFile(state),
    fetchOfflinePlayableErrorMessage:
      fromOfflinePlayable.getFetchOfflinePlayableErrorMessage(state),
    fetchOnlinePlayableErrorMessage:
      fromOnlinePlayable.getFetchOnlinePlayableErrorMessage(state),
    fetchFallbackPlayableErrorMessage:
      fromFallbackPlayable.getFetchFallbackPlayableErrorMessage(state),
  }),
  {
    fetchOfflinePlayable: fromOfflinePlayable.fetchOfflinePlayable,
    fetchOnlinePlayable: fromOnlinePlayable.fetchOnlinePlayable,
    fetchFallbackPlayable: fromFallbackPlayable.fetchFallbackPlayable,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setCurrentFile: fromCurrentFile.setCurrentFile,
  }
)(App);
