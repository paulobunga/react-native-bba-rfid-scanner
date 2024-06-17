import { NativeModules, Platform } from 'react-native';
const LINKING_ERROR = `The package 'react-native-bba-rfid-scanner' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
    '- You rebuilt the app after installing the package\n' +
    '- You are not using Expo Go\n';
const { C72RFIDScannerModule, AX6737RFIDScannerModule } = NativeModules;
if (!C72RFIDScannerModule || !AX6737RFIDScannerModule) {
    throw new Error(LINKING_ERROR);
}
export const C72RFIDScanner = {
    initializeReader: C72RFIDScannerModule.initializeReader,
    deInitializeReader: C72RFIDScannerModule.deInitializeReader,
    readSingleTag: C72RFIDScannerModule.readSingleTag,
    readPower: C72RFIDScannerModule.readPower,
    changePower: C72RFIDScannerModule.changePower,
    addListener: C72RFIDScannerModule.addListener,
    clearTags: C72RFIDScannerModule.clearTags,
    startReadingTags: C72RFIDScannerModule.startReadingTags,
    stopReadingTags: C72RFIDScannerModule.stopReadingTags,
    powerListener: C72RFIDScannerModule.powerListener,
    tagListener: C72RFIDScannerModule.tagListener,
};
export const AX6737RFIDScanner = {
    initializeReader: AX6737RFIDScannerModule.initializeReader,
    deInitializeReader: AX6737RFIDScannerModule.deInitializeReader,
    readSingleTag: AX6737RFIDScannerModule.readSingleTag,
    readPower: AX6737RFIDScannerModule.readPower,
    changePower: AX6737RFIDScannerModule.changePower,
    addListener: AX6737RFIDScannerModule.addListener,
    clearTags: AX6737RFIDScannerModule.clearTags,
    startReadingTags: AX6737RFIDScannerModule.startReadingTags,
    stopReadingTags: AX6737RFIDScannerModule.stopReadingTags,
    powerListener: AX6737RFIDScannerModule.powerListener,
    tagListener: AX6737RFIDScannerModule.tagListener,
};
