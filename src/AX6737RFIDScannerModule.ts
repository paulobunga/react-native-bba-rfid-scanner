import { NativeEventEmitter, NativeModules, type EmitterSubscription } from 'react-native';

const { AX6737RFIDScannerModule } = NativeModules;

const RFIDScannerEventEmitter = new NativeEventEmitter(AX6737RFIDScannerModule);

export interface AX6737RFIDScannerInterface {
    initializeReader: () => void;
    deInitializeReader: () => void;
    clearTags: () => Promise<void>;
    startReadingTags: (callback: (isStarted: boolean) => void) => void;
    stopReadingTags: (callback: (tagCount: number) => void) => void;
    readSingleTag: () => Promise<string[]>;
    addListener: (eventName: string) => void;
    removeListeners: (count: number) => void;
    addUHFTagListener: (callback: (tag: string[]) => void) => EmitterSubscription;
    addUHFPowerListener: (callback: (status: string) => void) => EmitterSubscription;

}

const initializeReader: AX6737RFIDScannerInterface['initializeReader'] = () => {
    AX6737RFIDScannerModule.initializeReader();
};

const deInitializeReader: AX6737RFIDScannerInterface['deInitializeReader'] = () => {
    AX6737RFIDScannerModule.deInitializeReader();
};


const clearTags: AX6737RFIDScannerInterface['clearTags'] = () => {
    return new Promise((resolve, reject) => {
        AX6737RFIDScannerModule.clearTags()
            .then((value: any) => resolve(value))
            .catch((error: any) => reject(error));
    });
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

const addUHFTagListener: AX6737RFIDScannerInterface['addUHFTagListener'] = (callback: (tag: string[]) => void): EmitterSubscription => {
    const subscription = RFIDScannerEventEmitter.addListener('UHF_TAG', callback);
    return subscription;
};

const addUHFPowerListener: AX6737RFIDScannerInterface['addUHFPowerListener'] = (callback: (status: string) => void): EmitterSubscription => {
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