import * as React from 'react';
import {
    Table,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    List,
    ListItem,
} from 'material-ui';
import { DicomEntry, DicomData, DicomGroupEntry } from '../../model/dicom-entry';

interface DicomTableProps {
    data: DicomData;
}

interface DicomTableState {
}

export class DicomTable extends React.Component<DicomTableProps, DicomTableState> {

    constructor(props: DicomTableProps) {
        super(props);
    }

    render() {
        let finalArr: DicomEntry[] = [];
        let groupArray: DicomGroupEntry[] = [];
        if (this.props.data) {

            for (var groupNumber in this.props.data) {
                if (groupNumber) {
                    groupArray.push(this.props.data[groupNumber]);
                    this.props.data[groupNumber].entries.forEach(_ => {
                        finalArr.push(_);
                    });
                }
            }
            return (
                <List>
                    {groupArray.map((group, groupIndex) => {
                        return (
                            <ListItem
                                primaryText={group.groupNumber}
                                key={groupIndex}
                                nestedItems={[

                                    <ListItem disabled={true} key={groupIndex}>
                                        {group.entries.map((entry, entryIndex) => {
                                            return (
                                                <Table selectable={false} key={entryIndex}>
                                                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                                        <TableRow>
                                                            <TableHeaderColumn>{entry.tagGroup}{", "}{entry.tagElement}</TableHeaderColumn>
                                                            <TableHeaderColumn>{entry.tagName}</TableHeaderColumn>
                                                            <TableHeaderColumn>{entry.tagValue}</TableHeaderColumn>
                                                            <TableHeaderColumn>{entry.tagVR}</TableHeaderColumn>
                                                            <TableHeaderColumn>{entry.tagVM}</TableHeaderColumn>
                                                        </TableRow>
                                                    </TableHeader>
                                                </Table>
                                            );
                                        })}
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
