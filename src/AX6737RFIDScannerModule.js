import { NativeEventEmitter, NativeModules } from 'react-native';
const { AX6737RFIDScannerModule } = NativeModules;
const RFIDScannerEventEmitter = new NativeEventEmitter(AX6737RFIDScannerModule);
const initializeReader = () => {
    AX6737RFIDScannerModule.initializeReader();
};
const deInitializeReader = () => {
    AX6737RFIDScannerModule.deInitializeReader();
};
const clearTags = () => {
    AX6737RFIDScannerModule.clearTags();
};
const startReadingTags = (callback) => {
    AX6737RFIDScannerModule.startReadingTags(callback);
};
const stopReadingTags = (callback) => {
    AX6737RFIDScannerModule.stopReadingTags(callback);
};
const readSingleTag = () => {
    return new Promise((resolve, reject) => {
        AX6737RFIDScannerModule.readSingleTag()
            .then((tagData) => {
            resolve(tagData);
        })
            .catch((error) => {
            reject(error);
        });
    });
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
    AX6737RFIDScannerModule.removeListeners(count);
};
const addListener = (eventName) => {
    AX6737RFIDScannerModule.addListener(eventName);
};
const AX6737RFIDScanner = {
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
export default AX6737RFIDScanner;
