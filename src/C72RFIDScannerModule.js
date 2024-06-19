import { NativeEventEmitter, NativeModules } from 'react-native';
const { C72RFIDScannerModule } = NativeModules;
const RFIDScannerEventEmitter = new NativeEventEmitter(C72RFIDScannerModule);
const initializeReader = () => {
    C72RFIDScannerModule.initializeReader();
};
const deInitializeReader = () => {
    C72RFIDScannerModule.deInitializeReader();
};
const readSingleTag = () => {
    return new Promise((resolve, reject) => {
        C72RFIDScannerModule.readSingleTag()
            .then((tagData) => {
            resolve(tagData);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
const startReadingTags = (callback) => {
    C72RFIDScannerModule.startReadingTags(callback);
};
const stopReadingTags = (callback) => {
    C72RFIDScannerModule.stopReadingTags(callback);
};
const clearTags = () => {
    C72RFIDScannerModule.clearTags();
};
const addUHFTagListener = (callback) => {
    const subscription = RFIDScannerEventEmitter.addListener('UHF_TAG', callback);
    return subscription;
};
const addUHFPowerListener = (callback) => {
    const subscription = RFIDScannerEventEmitter.addListener('UHF_POWER', callback);
    return subscription;
};
const removeListeners = (count) => {
    C72RFIDScannerModule.removeListeners(count);
};
const addListener = (eventName) => {
    C72RFIDScannerModule.addListener(eventName);
};
const C72RFIDScanner = {
    initializeReader,
    deInitializeReader,
    readSingleTag,
    startReadingTags,
    stopReadingTags,
    clearTags,
    addUHFTagListener,
    addUHFPowerListener,
    removeListeners,
    addListener,
};
export default C72RFIDScanner;
