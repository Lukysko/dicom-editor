import { DicomExtendedData, DicomSimpleData, DicomEntry } from './../model/dicom-entry';
import { getModuleNamesForTag } from './module-name-translator';

export function convertSimpleDicomToExtended(simpleDicom: DicomSimpleData): DicomExtendedData {
    let result: DicomExtendedData = {
    };

    for (let dicomEntry of simpleDicom.entries) {
        let moduleNames = getModuleNamesForTag(dicomEntry.tagGroup + dicomEntry.tagElement);

        for (let moduleName of moduleNames) {
            // module is in result array already
            if (result[moduleName]) {
                result[moduleName].push(dicomEntry);
            } else { // create new module with dicom entry
                result[moduleName] = [dicomEntry];
            }
        }
    }

    // data is sorted in table
    return result;
}

export function sortDicomEntries(entries: DicomEntry[]): DicomEntry[] {
    return entries.sort((elementA, elemenetB) => {
        let groupResult = elementA.tagGroup.localeCompare(elemenetB.tagGroup);

        // if tag groupes are different
        if (groupResult !== 0) {
            return groupResult;
        }

        // if groups equal, sort by tag element
        let groupElement = elementA.tagElement.localeCompare(elemenetB.tagElement);

        return groupElement;
    });
}