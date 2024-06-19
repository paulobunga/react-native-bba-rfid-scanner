import { NativeEventEmitter, NativeModules, type EmitterSubscription } from 'react-native';

const { C72RFIDScannerModule } = NativeModules;

const RFIDScannerEventEmitter = new NativeEventEmitter(C72RFIDScannerModule);

export interface C72RFIDScannerInterface {
    initializeReader: () => void;
    deInitializeReader: () => void;
    clearTags: () => void;
    startReadingTags: (callback: (isStarted: boolean) => void) => void;
    stopReadingTags: (callback: (tagCount: number) => void) => void;
    readSingleTag: () => Promise<string[]>;
    addListener: (eventName: string) => void;
    removeListeners: (count: number) => void;
    addUHFTagListener: (callback: (tag: string[]) => void) => EmitterSubscription;
    addUHFPowerListener: (callback: (status: string) => void) => EmitterSubscription;
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

const clearTags: C72RFIDScannerInterface['clearTags'] = () => {
    C72RFIDScannerModule.clearTags();
};

const addUHFTagListener: C72RFIDScannerInterface['addUHFTagListener'] = (callback: (tag: string[]) => void): EmitterSubscription => {
    const subscription = RFIDScannerEventEmitter.addListener('UHF_TAG', callback);
    return subscription;
};

const addUHFPowerListener: C72RFIDScannerInterface['addUHFPowerListener'] = (callback: (status: string) => void): EmitterSubscription => {
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
    clearTags,
    addUHFTagListener,
    addUHFPowerListener,
    removeListeners,
    addListener,
};

export default C72RFIDScanner;