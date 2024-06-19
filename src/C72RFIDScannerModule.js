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
const readPower = () => {
    return new Promise((resolve, reject) => {
        C72RFIDScannerModule.readPower()
            .then((powerValue) => {
            resolve(powerValue);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
const changePower = (powerValue) => {
    return new Promise((resolve, reject) => {
        C72RFIDScannerModule.changePower(powerValue)
            .then((powerState) => {
            resolve(powerState);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
const writeDataIntoEpc = (epc) => {
    return new Promise((resolve, reject) => {
        C72RFIDScannerModule.writeDataIntoEpc(epc)
            .then((writeState) => {
            resolve(writeState);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
const clearTags = () => {
    C72RFIDScannerModule.clearTags();
};
const findTag = (findEpc, callback) => {
    C72RFIDScannerModule.findTag(findEpc, callback);
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
    readPower,
    changePower,
    writeDataIntoEpc,
    clearTags,
    findTag,
    addUHFTagListener,
    addUHFPowerListener,
    removeListeners,
    addListener,
};
export default C72RFIDScanner;
