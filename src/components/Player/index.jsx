import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pdfjsLib from 'pdfjs-dist';
import { convertDataURIToBinary } from '../../util/misc';
import * as fromCurrentPage from '../../ducks/currentPage';
import styles from './index.scss';

// TODO: REFACTOR TO ALLOW CHANGING OF CURRENTFILE
const INTERVAL = 10;
class Player extends Component {
  componentDidMount() {
    const { currentFile, currentPage, setCurrentPage } = this.props;
    let intervalPage = currentPage;
    const rootEl = document.getElementById(styles.root);
    const canvasEl = document.getElementById(styles.rootCanvas);
    this.coverEl = document.getElementById(styles.rootCover);
    const rootWidth = rootEl.offsetWidth;
    const rootHeight = rootEl.offsetHeight;
    pdfjsLib.PDFJS.workerSrc = './pdf.worker.bundle.js';
    const loadingTask = pdfjsLib.getDocument(convertDataURIToBinary(currentFile));
    loadingTask.promise.then(pdfDocument => {
      this.renderPage = pageNumber => {
        pdfDocument.getPage(pageNumber).then(pdfPage => {
          let viewport = pdfPage.getViewport(1);
          const pdfWidth = viewport.width;
          const pdfHeight = viewport.height;
          const scaleX = rootWidth / pdfWidth;
          const scaleY = rootHeight / pdfHeight;
          const scale = Math.min(scaleX, scaleY);
          canvasEl.width = pdfWidth * scale;
          canvasEl.height = pdfHeight * scale;
          viewport = pdfPage.getViewport(scale);
          const ctx = canvasEl.getContext('2d');
          pdfPage.render({
            canvasContext: ctx,
            viewport,
          });
        });
      };
      const numPages = pdfDocument.numPages;
      this.coverEl.style.opacity = 0;
      this.renderPage(currentPage);
      window.setTimeout(() => {
        this.coverEl.style.opacity = 1;
      }, (INTERVAL - 1) * 1000);
      this.interval = window.setInterval(() => {
        intervalPage = intervalPage < numPages ? intervalPage + 1 : 1;
        setCurrentPage(intervalPage);
      }, INTERVAL * 1000);
    });
  }
  componentWillReceiveProps(nextProps) {
    const nextCurrentPage = nextProps.currentPage;
    this.coverEl.style.opacity = 0;
    this.renderPage(nextCurrentPage);
    window.setTimeout(() => {
      this.coverEl.style.opacity = 1;
    }, (INTERVAL - 1) * 1000);
  }
  componentWillUpdate() {
    return false;
  }
  componentWillUnmount() {
    if (this.interval !== undefined) window.clearInterval(this.interval);
  }
  render() {
    return (
      <div id={styles.root}>
        <canvas id={styles.rootCanvas} />
        <div id={styles.rootCover} />
      </div>
    );
  }
}
Player.propTypes = {
  currentFile: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    currentPage: fromCurrentPage.getCurrentPage(state),
  }), {
    setCurrentPage: fromCurrentPage.setCurrentPage,
  }
)(Player);
