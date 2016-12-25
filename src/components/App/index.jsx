import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromDefaultPlayable from '../../ducks/defaultPlayable';
import * as fromPlayable from '../../ducks/playable';
import * as fromFallbackPlayable from '../../ducks/fallbackPlayable';
import * as fromCurrentFile from '../../ducks/currentFile';
import Blocking from '../Blocking';
import AppError from './AppError';
import Player from '../Player';

class App extends Component {
  componentDidMount() {
    const {
      fetchDefaultPlayable,
      fetchPlayable,
      setAppBlocking,
      setCurrentFile,
    } = this.props;
    Promise.all([
      fetchDefaultPlayable(),
      fetchPlayable(),
    ])
      .then(
        () => {
          const playableFile = fromPlayable.getPlayableFile();
          if (playableFile === null) {
            this.setFallbackFile();
            return;
          }
          setCurrentFile(playableFile);
          setAppBlocking(false);
        },
        (error) => {
          if (process.env.NODE_ENV !== 'production'
            && error.name !== 'ServerException') {
            window.console.log(error);
            return;
          }
          this.setFallbackFile();
        }
      );
  }
  setFallbackFile() {
    const { fetchFallbackPlayable, setCurrentFile, setAppBlocking } = this.props;
    const storedDefaultPlayableFile = fromDefaultPlayable.getStoredDefaultPlayableFile();
    if (storedDefaultPlayableFile !== null) {
      setCurrentFile(storedDefaultPlayableFile);
      setAppBlocking(false);
      return;
    }
    fetchFallbackPlayable()
      .then(
        () => {
          const fallbackPlayableFile = fromFallbackPlayable.getFallbackPlayableFile();
          setCurrentFile(fallbackPlayableFile);
          setAppBlocking(false);
        },
        (error) => {
          if (process.env.NODE_ENV !== 'production'
            && error.name !== 'ServerException') {
            window.console.log(error);
            return;
          }
          setAppBlocking(false);
        }
      );
  }
  render() {
    const { currentFile } = this.props;
    const {
      appBlocking,
      fetchFallbackPlayableErrorMessage,
    } = this.props;
    if (appBlocking) return <Blocking />;
    if (fetchFallbackPlayableErrorMessage !== null) return <AppError />;
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
  fetchDefaultPlayable: PropTypes.func.isRequired,
  fetchFallbackPlayableErrorMessage: PropTypes.string,
  fetchPlayable: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setCurrentFile: PropTypes.func.isRequired,
};
export default connect(
  (state) => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    currentFile: fromCurrentFile.getCurrentFile(state),
    fetchFallbackPlayableErrorMessage:
      fromFallbackPlayable.getFetchFallbackPlayableErrorMessage(state),
  }),
  {
    fetchDefaultPlayable: fromDefaultPlayable.fetchDefaultPlayable,
    fetchPlayable: fromPlayable.fetchPlayable,
    fetchFallbackPlayable: fromFallbackPlayable.fetchFallbackPlayable,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setCurrentFile: fromCurrentFile.setCurrentFile,
  }
)(App);
