import { NativeEventEmitter, NativeModules } from 'react-native';

const { C72RFIDScannerModule } = NativeModules;

const RFIDScannerEventEmitter = new NativeEventEmitter(C72RFIDScannerModule);

export interface C72RFIDScannerInterface {
    initializeReader: () => void;
    deInitializeReader: () => void;
    readSingleTag: () => Promise<string[]>;
    startReadingTags: (callback: (uhfInventoryStatus: boolean) => void) => void;
    stopReadingTags: (callback: (tagCount: number) => void) => void;
    readPower: () => Promise<number>;
    changePower: (powerValue: number) => Promise<boolean>;
    writeDataIntoEpc: (epc: string) => Promise<boolean>;
    clearTags: () => void;
    findTag: (findEpc: string, callback: (uhfInventoryStatus: boolean) => void) => void;
    addListener: (eventName: string) => void;
    removeListeners: (count: number) => void;
}

const initializeReader: C72RFIDScannerInterface['initializeReader'] = () => {
    C72RFIDScannerModule.initializeReader();
};

const deInitializeReader: C72RFIDScannerInterface['deInitializeReader'] = () => {
    C72RFIDScannerModule.deInitializeReader();
};

const readSingleTag: C72RFIDScannerInterface['readSingleTag'] = () => {
    return new Promise((resolve, reject) => {
        C72RFIDScannerModule.readSingleTag()
            .then((tagData: string[]) => {
                resolve(tagData);
            })
            .catch((error: Error) => {
                reject(error);
            });
    });
};

const startReadingTags: C72RFIDScannerInterface['startReadingTags'] = (callback) => {
    C72RFIDScannerModule.startReadingTags(callback);
};

const stopReadingTags: C72RFIDScannerInterface['stopReadingTags'] = (callback) => {
    C72RFIDScannerModule.stopReadingTags(callback);
};

const readPower: C72RFIDScannerInterface['readPower'] = () => {
    return new Promise((resolve, reject) => {
        C72RFIDScannerModule.readPower()
            .then((powerValue: number) => {
                resolve(powerValue);
            })
            .catch((error: Error) => {
                reject(error);
            });
    });
};

const changePower: C72RFIDScannerInterface['changePower'] = (powerValue) => {
    return new Promise((resolve, reject) => {
        C72RFIDScannerModule.changePower(powerValue)
            .then((powerState: boolean) => {
                resolve(powerState);
            })
            .catch((error: Error) => {
                reject(error);
            });
    });
};

const writeDataIntoEpc: C72RFIDScannerInterface['writeDataIntoEpc'] = (epc) => {
    return new Promise((resolve, reject) => {
        C72RFIDScannerModule.writeDataIntoEpc(epc)
            .then((writeState: boolean) => {
                resolve(writeState);
            })
            .catch((error: Error) => {
                reject(error);
            });
    });
};

const clearTags: C72RFIDScannerInterface['clearTags'] = () => {
    C72RFIDScannerModule.clearTags();
};

const findTag: C72RFIDScannerInterface['findTag'] = (findEpc, callback) => {
    C72RFIDScannerModule.findTag(findEpc, callback);
};

const addUHFTagListener = (callback: (tag: string[]) => void) => {
    const subscription = RFIDScannerEventEmitter.addListener('UHF_TAG', callback);
    return subscription;
};

const addUHFPowerListener = (callback: (status: string) => void) => {
    const subscription = RFIDScannerEventEmitter.addListener('UHF_POWER', callback);
    return subscription;
};

const removeListeners: C72RFIDScannerInterface['removeListeners'] = (count) => {
    C72RFIDScannerModule.removeListeners(count);
};

const addListener: C72RFIDScannerInterface['addListener'] = (eventName) => {
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