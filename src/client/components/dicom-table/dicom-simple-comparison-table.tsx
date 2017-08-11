import * as React from 'react';
import { DicomEntry, DicomComparisonData } from '../../model/dicom-entry';
import { DicomTableHeader } from './dicom-table-header';
import { TableHeader, Table, TableBody } from 'material-ui';
import { DicomTableRow } from './dicom-table-row';
import { TableRow, TableRowColumn } from 'material-ui';

export interface DicomSimpleComparisonTableProps {
    comparisonData: DicomComparisonData[];
    showOnlyDiffs: boolean;
}

export interface DicomSimpleComparisonTableState {

}

// This component displays a table of all entries belonging to a single module
export class DicomSimpleComparisonTable extends React.Component<
    DicomSimpleComparisonTableProps,
    DicomSimpleComparisonTableState> {
    public constructor(props: DicomSimpleComparisonTableProps) {
        super(props);
    }

    public render() {
        return (
            <Table selectable={false}>
                <TableHeader
                    className="tableHeader"
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                >
                    {/* Header containing tag value names*/}
                    <DicomTableHeader />
                </TableHeader>
                <TableBody selectable={false} displayRowCheckbox={false}>

                    {this.props.comparisonData.reduce((
                        arr: JSX.Element[], group, groupIndex) => {
                        {/* if header, print once*/ }
                        if (group.group.length > 1) {
                            let entryHeader: DicomEntry = {
                                tagGroup: group.group[0].tagGroup,
                                tagElement: group.group[0].tagElement,
                                tagName: '',
                                tagValue: '',
                                tagVR: '',
                                tagVM: '',
                                colour: '#000000',
                                sequence: []
                            };
                            arr.push(
                                <DicomTableRow entry={entryHeader} shouldShowTag={true} key={groupIndex} />
                            );
                            group.group.map((entry, entryIndex) => {

                                arr.push(

                                    <DicomTableRow
                                        entry={entry}
                                        shouldShowTag={false}
                                        key={entryIndex + 1000 * (groupIndex + 1)}
                                    />
                                );
                            });

                        } else if (group.group.length === 1 && this.props.showOnlyDiffs === false) {
                            arr.push(
                                <DicomTableRow entry={group.group[0]} shouldShowTag={true} key={groupIndex} />
                            );
                        }
                        if (arr.length < 1) {
                            arr.push(
                                <TableRow key="empty-row-no-differences">
                                    <TableRowColumn><h3>No differences found</h3></TableRowColumn>
                                </TableRow>
                            );
                        }
                        return arr;
                    },                                [])}
                </TableBody>
            </Table>
        );
    }
}