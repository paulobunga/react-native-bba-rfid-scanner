import { NativeEventEmitter, NativeModules } from 'react-native';

const { AX6737RFIDScannerModule } = NativeModules;

const RFIDScannerEventEmitter = new NativeEventEmitter(AX6737RFIDScannerModule);

export interface AX6737RFIDScannerInterface {
    initializeDevice: () => void;
    clearTags: () => void;
    startReadingTags: (callback: (isStarted: boolean) => void) => void;
    stopReadingTags: (callback: (tagCount: number) => void) => void;
    readSingleTag: () => Promise<string[]>;
    addListener: (eventName: string) => void;
    removeListeners: (count: number) => void;
}

const initializeDevice: AX6737RFIDScannerInterface['initializeDevice'] = () => {
    AX6737RFIDScannerModule.initializeDevice();
};

const clearTags: AX6737RFIDScannerInterface['clearTags'] = () => {
    AX6737RFIDScannerModule.clearTags();
};

const startReadingTags: AX6737RFIDScannerInterface['startReadingTags'] = (callback) => {
    AX6737RFIDScannerModule.startReadingTags(callback);
};

const stopReadingTags: AX6737RFIDScannerInterface['stopReadingTags'] = (callback) => {
    AX6737RFIDScannerModule.stopReadingTags(callback);
};

const readSingleTag: AX6737RFIDScannerInterface['readSingleTag'] = () => {
    return new Promise((resolve, reject) => {
        AX6737RFIDScannerModule.readSingleTag()
            .then((tagData: string[]) => {
                resolve(tagData);
            })
            .catch((error: Error) => {
                reject(error);
            });
    });
};

const addUHFTagListener = (callback: (tag: string[]) => void) => {
    const subscription = RFIDScannerEventEmitter.addListener('UHF_TAG', callback);
    return subscription;
};

const addUHFPowerListener = (callback: (status: string) => void) => {
    const subscription = RFIDScannerEventEmitter.addListener('UHF_POWER', callback);
    return subscription;
};

const removeListeners: AX6737RFIDScannerInterface['removeListeners'] = (count) => {
    AX6737RFIDScannerModule.removeListeners(count);
};

const addListener: AX6737RFIDScannerInterface['addListener'] = (eventName) => {
    AX6737RFIDScannerModule.addListener(eventName);
};

const AX6737RFIDScanner = {
    addListener,
    removeListeners,
    addUHFPowerListener,
    addUHFTagListener,
    readSingleTag,
    startReadingTags,
    stopReadingTags,
    clearTags,
    initializeDevice,
};

export default AX6737RFIDScanner;