import * as React from 'react';
import * as cornerstone from './cornerstone-library/cornerstone.js';
import { buffersEqual } from '../../utils/file-converter';
var cornerstoneWADOImageLoader = require('./cornerstone-library/DCMLoader');

interface ImageCanvasProps {
  data: Uint8Array;
}

export class ImageCanvas extends React.Component<ImageCanvasProps, {}> {

  constructor(props: ImageCanvasProps) {
    super(props);
  }

  renderCanvas(data: Uint8Array) {
    var imageElement = document.getElementById('dicomImage') as Element;

    var fileNew = new Blob([data], { type: 'File' });

    var imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(fileNew);
    cornerstone.loadImage(imageId).then(function (image: Object) {
      var viewport = cornerstone.getDefaultViewport(imageElement.children[0], image);
      cornerstone.displayImage(imageElement, image, viewport);
    });
  }

  componentDidMount() {
    var element = document.getElementById('dicomImage') as Element;
    cornerstone.enable(element);
  }
  componentDidUpdate() {
    if (this.props.data.length > 0) {
      this.renderCanvas(this.props.data);
    }
  }

  shouldComponentUpdate(nextProps: ImageCanvasProps) {
    return (!buffersEqual(nextProps.data, this.props.data));
  }

  render() {
    return (
      <div>
        <div id="dicomImage" style={{ width: '512px', height: '512px' }} />
      </div>
    );
  }
}