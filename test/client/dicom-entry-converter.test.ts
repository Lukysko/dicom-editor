import { DicomSimpleData, DicomExtendedData, DicomEntry } from './../../src/client/model/dicom-entry';
import { expect } from 'chai';
import { convertSimpleDicomToExtended, sortDicomEntries, filterRedundantModulesBySopClass } from '../../src/client/utils/dicom-entry-converter';
import { getModuleNamesForTag } from '../../src/client/utils/module-name-translator';

// convertSimpleDicomToExtended
describe('dicom-entry-converter', () => {
    it('should convert empty simple Dicom data to empty extended', () => {
        let dicomSimple: DicomSimpleData = {
            entries: []
        };
        let expectedDicomExtended: DicomExtendedData = {};
        let resultDicom = convertSimpleDicomToExtended(dicomSimple);
        expect(resultDicom).to.deep.equal(expectedDicomExtended);
    });

    it('should convert simple Dicom data to extended', () => {
        let dicomSimple: DicomSimpleData = {
            entries: [
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0008',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                },
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0007',
                    tagElement: '0016',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                },
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0012',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                }
            ]
        };

        let expectedDicomExtended: DicomExtendedData = {
            'SOP Common': [
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    colour: '#000000',
                    sequence: [],
                    tagElement: '0012',
                    tagGroup: '0008',
                    tagName: 'MY TAG',
                    tagVM: '2',
                    tagVR: 'AA',
                    tagValue: 'TAG VALUE'
                }
            ],
            'Protocol Context': [
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0008',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                }
            ],  
            'Undefined module group': [
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0007',
                    tagElement: '0016',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                },
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0012',
                    tagElement: '0012',
                    tagName: 'MY TAG',
                    tagValue: 'TAG VALUE',
                    tagVR: 'AA',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                }
            ]
        };
        let resultDicom = convertSimpleDicomToExtended(dicomSimple);
        expect(resultDicom).to.deep.equal(expectedDicomExtended);
    });
});

// getModuleNamesForTag
describe('module-name-translator', () => {
    it('should get multiple module names for tag', () => {
        let moduleName = getModuleNamesForTag('00080012');
        expect(moduleName).to.deep.equal(['SOP Common', 'Protocol Context']);
    })

    it('should get undefined module name for tag', () => {
        let moduleName = getModuleNamesForTag('00070016');
        expect(moduleName).to.deep.equal(['Undefined module group']);
    })

    // it('should get multiple module names for tag', () => {
    //     let moduleName = getModuleNamesForTag('0040a0b0');
    //     expect(moduleName).to.deep.equal([
    //         'Waveform Annotation',
    //         'Waveform'
    //     ]);
    // })
});
describe('dicom-entry-converter-sortDicomEntries', () => {
    it('should sort Dicom entries', () => {

        let originalEntries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0002',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []
            },
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []

            },
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0001',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []

            },
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0002',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []

            },
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0003',
                tagElement: '0006',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []

            }
        ];

        let expectedEntries: DicomEntry[] = [
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0002',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []

            },
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0003',
                tagElement: '0006',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []

            },
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0001',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []

            },
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0002',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []

            },
            {
                id: 1,
                offset: 12345,
                byteLength: 0,
                tagGroup: '0008',
                tagElement: '0004',
                tagName: 'TAG-NAME',
                tagValue: 'TAG-VALUE',
                tagVR: 'VM',
                tagVM: '2',
                colour: '#000000',
                sequence: []

            }
        ];

        let sortedEntries = sortDicomEntries(originalEntries);
        expect(sortedEntries).to.deep.equal(expectedEntries);
    })

    it('should sort empty array to empty array', () => {
        let originalEntries: DicomEntry[] = [

        ];

        let expectedEntries: DicomEntry[] = [

        ];

        let sortedEntries = sortDicomEntries(originalEntries);
        expect(sortedEntries).to.deep.equal(expectedEntries);
    })
});

describe('DicomEntryConverter -> filterRedundantModulesBySopClass()', () => {
    it('should return correctly filtered modules by sop class', () => {

        let expectedFiltered: DicomExtendedData = {
            'Patient':
            [
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0008',
                    tagElement: '0145',
                    tagName: 'PatientName',
                    tagValue: 'Michal Mrkvicka',
                    tagVR: 'PN',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                },
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0008',
                    tagElement: '1548',
                    tagName: 'PatientAge',
                    tagValue: '18',
                    tagVR: 'PA',
                    tagVM: '1',
                    colour: '#000000',
                    sequence: []
                }
            ]

        };

        let dicomExtended: DicomExtendedData = {
            'Patient':
            [
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0008',
                    tagElement: '0145',
                    tagName: 'PatientName',
                    tagValue: 'Michal Mrkvicka',
                    tagVR: 'PN',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                },
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0008',
                    tagElement: '1548',
                    tagName: 'PatientAge',
                    tagValue: '18',
                    tagVR: 'PA',
                    tagVM: '1',
                    colour: '#000000',
                    sequence: []
                }
            ]
            ,
            'DX Series':
            [
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0010',
                    tagElement: '0145',
                    tagName: 'PatientName',
                    tagValue: 'Michal Mrkvicka',
                    tagVR: 'PN',
                    tagVM: '2',
                    colour: '#000000',
                    sequence: []
                },
                {
                    id: 1,
                    offset: 12345,
                    byteLength: 0,
                    tagGroup: '0010',
                    tagElement: '1548',
                    tagName: 'PatientAge',
                    tagValue: '18',
                    tagVR: 'PA',
                    tagVM: '1',
                    colour: '#000000',
                    sequence: []
                }
            ]
        }

        let actualFiltered = filterRedundantModulesBySopClass(dicomExtended, '1.2.840.10008.5.1.4.1.1.1');

        expect(actualFiltered).to.deep.equal(expectedFiltered);
    });
});