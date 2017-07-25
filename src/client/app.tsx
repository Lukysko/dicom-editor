import * as React from 'react';
import AppBar from 'material-ui/AppBar';

import SideBar from './components/side-bar';
import MainView from './containers/main-view';
import FileDropZone from './components/file-loader/file-drop-zone';

import './app.css';
import { ApplicationStateReducer } from './application-state';

import { FileStorage } from './utils/file-storage';

let reducer = new ApplicationStateReducer();
let fileStorage = new FileStorage(reducer);
fileStorage.loadRecentFiles();

interface AppState {
}

export default class App extends React.Component<{}, AppState> {

  public constructor(props: {}) {
    super(props);
  }

  public componentDidMount() {
    // reducer.state$.subscribe(_ => {this.setState({dicomData: _.dicomData});});
  }

  render() {
    return (
      <div className="app">
        <AppBar
          className="app-bar"
          title="Dicom Viewer"
        />
        <FileDropZone reducer={reducer} >
          <div className="app-view">
            {/*<Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />*/}
            <div className="main-content">
              {/*<FileLoader reducer={reducer}/>
              <DicomTable data={this.state.dicomEntries}/>*/}
              <MainView reducer={reducer}/>
              {/*<Switch>
                <Route exact path="/dashboard" render={() => (<Dashboard />)} />
                <Route exact path="/containers" render={() => (<ContainersPage />)} />
                <Route exact path="/containers/new" render={() => (<NewContainerPage />)} />
                <Route exact path="/containers/:Id" render={(props) => (<ContainerInspectPage {...props} />)} />
                <Route exact path="/images" render={() => (<ImagesPage />)} />
                <Route exact path="/networks" render={() => (<NetworksPage />)} />
                <Route exact path="/volumes" render={() => (<VolumesPage />)} />
              </Switch>*/}
            </div>
            <SideBar reducer={reducer}/>
          </div>
        </FileDropZone>
      </div>
    );
  }
}