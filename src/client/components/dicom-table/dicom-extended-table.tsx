import * as React from 'react';
import {
    List,
    ListItem,
} from 'material-ui';
import { DicomExtendedData, DicomEntry } from '../../model/dicom-entry';
import './dicom-table.css';
import { DicomSimpleTable } from './dicom-simple-table';
import { sortDicomEntries } from '../../utils/dicom-entry-converter';
import { ApplicationStateReducer } from '../../application-state';

interface TableData {
    entries: DicomEntry[];
    moduleName: string;
}

interface DicomExtendedTableProps {
    data: DicomExtendedData;
    reducer: ApplicationStateReducer;
}

interface DicomExtendedTableState {
}

export class DicomExtendedTable extends React.Component<DicomExtendedTableProps, DicomExtendedTableState> {

    constructor(props: DicomExtendedTableProps) {
        super(props);
    }

    render() {
        let moduleArray: TableData[] = [];
        
        if (this.props.data) {

            for (var moduleName in this.props.data) {
                if (moduleName) {
                    let data: TableData = {
                        entries: sortDicomEntries(this.props.data[moduleName]),
                        moduleName: moduleName
                    };
                    moduleArray.push(data);
                }
            }

            moduleArray.sort((elementA: TableData, elementB: TableData) => {
                return elementA.moduleName.localeCompare(elementB.moduleName);
            });
            return (
                <List>
                    {/* iterates over modules */}
                    { moduleArray.map((module, moduleIndex) => {
                        return (
                            <ListItem
                                primaryText={module.moduleName}
                                key={moduleIndex}
                                primaryTogglesNestedList={true}                
                                nestedItems={[
            
                                 <ListItem disabled={true} key={moduleIndex}>
                                     <DicomSimpleTable entries={module.entries} reducer={this.props.reducer}/>
                                </ListItem>

                                ]}
                            />
                        );
                    })}
                </List>
            );
        } else {
            return (<div />);
        }
    }
}
