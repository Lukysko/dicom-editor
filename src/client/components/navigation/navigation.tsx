import * as React from 'react';
import { MenuItem, Drawer, AppBar } from 'material-ui';
import './navigation.css';
import { ExportDialog } from '../export/export-dialog';
import { ApplicationStateReducer } from '../../application-state';
import { HeavyweightFile } from '../../model/file-interfaces';
import { OverridePopUpDialog } from './override-popup-dialog';
import { ConflictPopUpDialog } from './conflict-popup-dialog';
import { isFileSavedInDb } from '../../utils/file-store-util';
import {
    saveFileIntoSavedDb,
    convertHeavyToLight
} from '../../utils/file-store-util';
import { RecentFileStoreUtil } from '../../utils/recent-file-store-util';
import { NavigationMenuUtil, ApplicationMenuItem } from './navigation-menu-util';

export interface NavigationProps {
    reducer: ApplicationStateReducer;
}

export interface NavigationState {
    sideBarOpen: boolean;
    openedExportDialog: boolean;
    openedConflictDialog: boolean;
    openedOverrideDialog: boolean;
    conflictFiles: HeavyweightFile[];
    compareItem: ApplicationMenuItem;
    exportItem: ApplicationMenuItem;
    saveItem: ApplicationMenuItem;
    unloadItem: ApplicationMenuItem;
}

export class Navigation extends React.Component<NavigationProps, NavigationState> {
    public constructor(props: NavigationProps) {
        super(props);
        this.handleCloseExportDialog = this.handleCloseExportDialog.bind(this);
        this.handleCloseOverwriteDialog = this.handleCloseOverwriteDialog.bind(this);
        this.handleCloseConflictDialog = this.handleCloseConflictDialog.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.overwriteAll = this.overwriteAll.bind(this);
        this.skipAll = this.skipAll.bind(this);
        this.handleCancelOverwriteDialog = this.handleCancelOverwriteDialog.bind(this);
        this.showPopUpOverrideConfirmation = this.showPopUpOverrideConfirmation.bind(this);
        this.handleUnloadClick = this.handleUnloadClick.bind(this);

        this.state = {
            sideBarOpen: false,
            openedExportDialog: false,
            openedConflictDialog: false,
            openedOverrideDialog: false,
            conflictFiles: [],
            compareItem: {
                text: '',
                disabled: false
            },
            exportItem: {
                text: '',
                disabled: false
            },
            saveItem: {
                text: '',
                disabled: false
            },

            unloadItem: {
                text: '',
                disabled: false
            }

        };
    }

    public componentDidMount() {
        this.props.reducer.state$.subscribe(state => {
            let menuUtil = new NavigationMenuUtil(state);
            let newMenu = menuUtil.getActualMenu();

            this.setState({
                compareItem: newMenu.compareItem,
                exportItem: newMenu.exportItem,
                saveItem: newMenu.saveItem,
                unloadItem: newMenu.unloadItem
            });

        });
    }

    public render() {
        return (

            <div>
                <Drawer
                    open={this.state.sideBarOpen}
                    docked={false}

                    onRequestChange={(sideBarOpen) => this.setState({ sideBarOpen })}
                >
                    <div id="logo-left-wrapper">
                        <img src="../../../assets/img/logo.png" alt="Dicom Viewer" id="logo-left" />
                    </div>
                    <div id="dicom-title"><span>DICOM VIEWER</span></div>
                    <MenuItem
                        primaryText={this.state.exportItem.text}
                        onClick={() => this.showExportDialog()}
                        disabled={this.state.exportItem.disabled}
                    />
                    <MenuItem
                        primaryText={this.state.saveItem.text}
                        onClick={() => this.handleSaveClick()}
                        disabled={this.state.saveItem.disabled}
                    />
                    <MenuItem
                        primaryText={this.state.unloadItem.text}
                        onClick={() => this.handleUnloadClick()}
                        disabled={this.state.unloadItem.disabled}
                    />
                    <ExportDialog
                        reducer={this.props.reducer}
                        handleClosePopUpDialog={this.handleCloseExportDialog}
                        openedPopUpDialog={this.state.openedExportDialog}
                    />
                    <OverridePopUpDialog
                        reducer={this.props.reducer}
                        saveFile={this.saveFile}
                        handleCloseOverrideDialog={this.handleCloseOverwriteDialog}
                        openedOverrideDialog={this.state.openedOverrideDialog}
                        fileName={this.state.conflictFiles[0] ? this.state.conflictFiles[0].fileName : ''}
                        handleCancelOverrideDialog={this.handleCancelOverwriteDialog}
                    />
                    <ConflictPopUpDialog
                        handleCloseDialog={this.handleCloseConflictDialog}
                        overWriteAll={this.overwriteAll}
                        skipAll={this.skipAll}
                        decideForEach={this.showPopUpOverrideConfirmation}
                        numberOfConflicting={this.state.conflictFiles.length}
                        openedPopUpDialog={this.state.openedConflictDialog}
                    />
                </Drawer>

                <AppBar
                    className="app-bar"
                    title="DICOM VIEWER"
                    onLeftIconButtonTouchTap={() => { this.setState({ sideBarOpen: !this.state.sideBarOpen }); }}
                />

            </div>

        );
    }

    private showExportDialog() {
        if (!this.state.exportItem.disabled) {
            this.setState({
                openedExportDialog: true
            });
        }
    }

    private handleCloseExportDialog() {
        this.setState({
            openedExportDialog: false,
            sideBarOpen: false
        });
    }

    /**
     * @description Displays pop up window to ask user if file should be overriden.
     */
    private showPopUpOverrideConfirmation() {
        this.setState({
            openedOverrideDialog: true
        });
    }

    private handleCancelOverwriteDialog() {
        let arr = this.state.conflictFiles;
        arr.shift();
        this.setState({
            conflictFiles: arr
        });
        if (this.state.conflictFiles.length === 0) {
            this.handleCloseOverwriteDialog();
        }
    }

    private handleCloseOverwriteDialog() {
        this.setState({
            openedOverrideDialog: false,
            sideBarOpen: false,
            conflictFiles: []
        });
    }

    private handleCloseConflictDialog() {
        this.setState({
            openedConflictDialog: false,
            sideBarOpen: false
        });
    }

    private overwriteAll() {
        this.state.conflictFiles.forEach(file => {
            this.saveFile(file);
        });
    }

    private skipAll() {
        this.setState({
            conflictFiles: []
        });
    }

    private handleSaveClick() {
        if (!this.state.saveItem.disabled) {
            let toBeSaved = this.props.reducer.getSelectedFiles();
            if (toBeSaved.length === 0) {
                let file: HeavyweightFile | undefined = this.props.reducer.getState().currentFile;
                if (file) {
                    toBeSaved.push(file);
                }
            }
            this.tryToSaveFiles(toBeSaved);
        }

    }

    private handleUnloadClick() {
        let filesToUnload = this.props.reducer.getSelectedFiles();
        if (filesToUnload.length === 0) {
            let current = this.props.reducer.getState().currentFile;
            if (current) {
                filesToUnload = [current];
            }
        }
        this.props.reducer.removeLoadedFiles(filesToUnload);
        this.setState({ sideBarOpen: !this.state.sideBarOpen });
    }

    private async tryToSaveFiles(toBeSaved: HeavyweightFile[]) {
        let inConflict: HeavyweightFile[] = [];
        for (var i = 0; i < toBeSaved.length; i++) {
            let success = await this.tryToSaveOneFile(toBeSaved[i]);
            if (!success) {
                inConflict.push(toBeSaved[i]);
            }
        }
        if (inConflict.length === 1) {
            this.setState({
                conflictFiles: inConflict,
                openedOverrideDialog: true
            });
        } else if (inConflict.length > 1) {
            this.setState({
                openedConflictDialog: true,
                conflictFiles: inConflict
            });
        }
    }

    private async tryToSaveOneFile(file: HeavyweightFile) {
        file.timestamp = (new Date()).getTime();
        let isSaved = await isFileSavedInDb(file);
        if (!isSaved) {
            this.saveFile(file);
            return true;
        }
        return false;
    }

    /**
     * @description Saves file into DB, app state and recent files
     * @param {HeavyweightFile} file file to save
     */
    private saveFile(file: HeavyweightFile) {
        let lightFile = convertHeavyToLight(file);
        let dbKey = saveFileIntoSavedDb(file);
        lightFile.dbKey = dbKey;
        let recentFileUtil: RecentFileStoreUtil = new RecentFileStoreUtil(this.props.reducer);
        recentFileUtil.handleStoringRecentFile(lightFile);
        this.props.reducer.addSavedFile(lightFile);
    }
}