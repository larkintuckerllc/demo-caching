import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import pdfjsLib from 'pdfjs-dist';
import { convertDataURIToBinary } from '../../util/misc';
import * as fromCurrentPage from '../../ducks/currentPage';
import styles from './index.scss';

const INTERVAL = 10;
class Player extends Component {
  componentDidMount() {
    const { currentFile, currentPage, setCurrentPage } = this.props;
    let intervalPage = currentPage;
    const rootEl = document.getElementById(styles.root);
    this.rootWidth = rootEl.offsetWidth;
    this.rootHeight = rootEl.offsetHeight;
    this.canvasEl = document.getElementById(styles.rootCanvas);
    this.coverEl = document.getElementById(styles.rootCover);
    pdfjsLib.PDFJS.workerSrc = './pdf.worker.bundle.js';
    const loadingTask = pdfjsLib.getDocument(convertDataURIToBinary(currentFile));
    loadingTask.promise.then(pdfDocument => {
      this.pdfDocument = pdfDocument;
      const numPages = this.pdfDocument.numPages;
      this.renderPage(currentPage);
      this.interval = window.setInterval(() => {
        intervalPage = intervalPage < numPages ? intervalPage + 1 : 1;
        setCurrentPage(intervalPage);
      }, INTERVAL * 1000);
    });
  }
  componentWillReceiveProps(nextProps) {
    const nextCurrentPage = nextProps.currentPage;
    this.renderPage(nextCurrentPage);
  }
  componentWillUpdate() {
    return false;
  }
  componentWillUnmount() {
    if (this.interval !== undefined) window.clearInterval(this.interval);
  }
  renderPage(pageNumber) {
    this.coverEl.style.opacity = 0;
    window.setTimeout(() => {
      this.coverEl.style.opacity = 1;
    }, (INTERVAL - 1) * 1000);
    this.pdfDocument.getPage(pageNumber).then(pdfPage => {
      let viewport = pdfPage.getViewport(1);
      const pdfWidth = viewport.width;
      const pdfHeight = viewport.height;
      const scaleX = this.rootWidth / pdfWidth;
      const scaleY = this.rootHeight / pdfHeight;
      const scale = Math.min(scaleX, scaleY);
      this.canvasEl.width = pdfWidth * scale;
      this.canvasEl.height = pdfHeight * scale;
      viewport = pdfPage.getViewport(scale);
      const ctx = this.canvasEl.getContext('2d');
      pdfPage.render({
        canvasContext: ctx,
        viewport,
      });
    });
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
