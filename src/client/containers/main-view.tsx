import * as React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import TagViewer from '../components/tag-viewer';
import ImageViewer from '../components/image-viewer/image-viewer';
import './main-view.css';
import { ApplicationStateReducer } from '../application-state';
import { HeavyweightFile, SelectedFile } from '../model/file-interfaces';
import { TableMode } from '../model/table-enum';
import Cached from 'material-ui/svg-icons/action/cached';
import { RaisedButton } from 'material-ui';
import Search from '../components/search-bar';
import MainViewHeader from './main-view-header';

const IMAGE_VIEWER_TAB_INDEX = 0;
const TAG_VIEWER_TAB_INDEX = 1;

interface MainViewProps {
  reducer: ApplicationStateReducer;
}

interface MainViewState {
  currentFile: HeavyweightFile;
  loadedFiles: HeavyweightFile[];
  selectedFiles: SelectedFile[];
  tableMode: TableMode;
  actualBufferData: Uint8Array;
  comparisonActive: boolean;
  selectedTab: number;
}

export default class MainView extends React.Component<MainViewProps, MainViewState> {

  public constructor(props: MainViewProps) {
    super(props);
    this.state = {
      currentFile: {
        fileSize: 0,
        bufferedData: new Uint8Array(0),
        dicomData: { entries: [] },
        fileName: '',
        timestamp: 0
      },
      selectedFiles: [],
      loadedFiles: [],
      actualBufferData: new Uint8Array(0),
      tableMode: TableMode.SIMPLE,
      comparisonActive: false,
      selectedTab: TAG_VIEWER_TAB_INDEX
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  public componentDidMount() {
    this.props.reducer.state$.subscribe(state => {
      this.setState({
        currentFile: state.currentFile ? state.currentFile :
          {
            fileSize: 0,
            bufferedData: new Uint8Array(0),
            dicomData: { entries: [] },
            fileName: '',
            timestamp: 0
          },
        selectedFiles: state.selectedFiles ? state.selectedFiles : [],
        loadedFiles: state.loadedFiles ? state.loadedFiles : [],
        actualBufferData: state.currentFile ? state.currentFile.bufferedData : new Uint8Array(0),
        comparisonActive: state.comparisonActive,
        selectedTab: state.comparisonActive ? TAG_VIEWER_TAB_INDEX : this.state.selectedTab
      });
    });
  }

  handleSelect(index: number) {
    this.setState({selectedTab: index});
  }

  render() {
    return (
      <Tabs 
        className="tabs" 
        initialSelectedIndex={TAG_VIEWER_TAB_INDEX} 
        value={this.state.comparisonActive ? TAG_VIEWER_TAB_INDEX : this.state.selectedTab}
      >
        <Tab
          label="Image viewer"
          disabled={this.state.comparisonActive}
          className={this.state.comparisonActive ? 'disabled-tab' : 'enabled-tab'}
          onActive={() => this.handleSelect(IMAGE_VIEWER_TAB_INDEX)}
          value={0}
        >
          <div className="container">
            <h1 className="file-name-h1">
              {
                this.state.currentFile.timestamp !== 0 ? this.state.currentFile.fileName.split('.')[0] : 'Image viewer'
              }
            </h1>
            <ImageViewer data={this.state.actualBufferData} />
          </div>
        </Tab>
        <Tab 
          label="Tags"
          onActive={() => this.handleSelect(TAG_VIEWER_TAB_INDEX)}
          value={1}
        >
          <div className="container">
            <MainViewHeader reducer={this.props.reducer} />
            <div id="simpleOrHierarchical">
              <RaisedButton
                icon={<Cached className="material-icons" />}
                primary={true}
                className="raisedButton-override"
                label={this.state.tableMode === TableMode.SIMPLE ? 'Hierarchical' : 'Simple'}
                onClick={() => this.setState({
                  tableMode:
                  this.state.tableMode === TableMode.SIMPLE ?
                    TableMode.EXTENDED : TableMode.SIMPLE
                })}
              />
              <Search reducer={this.props.reducer} />
            </div>
          </div>

          <div className="container">
            <TagViewer
              files={this.state.selectedFiles}
              tableMode={this.state.tableMode}
              currentFile={this.state.currentFile}
              comparisonActive={this.state.comparisonActive}
              reducer={this.props.reducer}
            />
          </div>
        </Tab>
      </Tabs >
    );
  }
}