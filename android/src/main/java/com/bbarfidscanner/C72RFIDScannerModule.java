package com.bbarfidscanner;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.module.annotations.ReactModule;

import android.util.Log;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.rscja.deviceapi.RFIDWithUHF;
import com.rscja.deviceapi.RFIDWithUHF.BankEnum;
import com.rscja.deviceapi.RFIDWithUHFUART;
import com.rscja.deviceapi.entity.UHFTAGInfo;
import com.rscja.deviceapi.interfaces.IUHF;

import java.util.ArrayList;
import java.util.List;

@ReactModule(name = C72RFIDScannerModule.NAME)
public class C72RFIDScannerModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
  public static final String NAME = "C72RFIDScannerModule";

  private static final String UHF_READER_POWER_ON_ERROR = "UHF_READER_POWER_ON_ERROR";
  private static final String UHF_READER_INIT_ERROR = "UHF_READER_INIT_ERROR";
  private static final String UHF_READER_READ_ERROR = "UHF_READER_READ_ERROR";
  private static final String UHF_READER_RELEASE_ERROR = "UHF_READER_RELEASE_ERROR";
  private static final String UHF_READER_WRITE_ERROR = "UHF_READER_WRITE_ERROR";
  private static final String UHF_READER_OTHER_ERROR = "UHF_READER_OTHER_ERROR";
  private final ReactApplicationContext reactContext;
  //private RFIDWithUHF mReader = null;
  public RFIDWithUHFUART mReader;
  private Boolean mReaderStatus = false;
  private List<String> scannedTags = new ArrayList<String>();
  private Boolean uhfInventoryStatus = false;
  private String deviceName = "";
  private int count = 0;

  public C72RFIDScannerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.reactContext.addLifecycleEventListener(this);
  }

  public static WritableArray convertArrayToWritableArray(String[] tag) {
    WritableArray array = new WritableNativeArray();
    for (String tagId : tag) {
      array.pushString(tagId);
    }
    return array;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  private void initializeReader() {
    Log.d("UHF Reader", "Initializing Reader");
    new UhfReaderPower().start();
  }

  @ReactMethod
  public void deInitializeReader() {
    Log.d("UHF Reader", "DeInitializing Reader");
    new UhfReaderPower(false).start();
  } 

  @ReactMethod
  public void clearTags(final Promise promise) {
    try {
      scannedTags.clear();
      promise.resolve();
    } catch(Exception ex) {
      promise.reject('ERROR', 'Failed to clear tags');
    }
  }

  @ReactMethod
  public void startReadingTags(final Callback callback) {
    uhfInventoryStatus = mReader.startInventoryTag();
    new TagThread().start();
    callback.invoke(uhfInventoryStatus);
  }

  @ReactMethod
  public void stopReadingTags(final Callback callback) {
    uhfInventoryStatus = !(mReader.stopInventory());
    callback.invoke(scannedTags.size());
  }

  @ReactMethod
  public void readSingleTag(final Promise promise) {
    try {
      UHFTAGInfo tag = mReader.inventorySingleTag();

      if (!tag.getEPC().isEmpty()) {
        String[] tagData = {tag.getEPC(), tag.getRssi()};
        promise.resolve(convertArrayToWritableArray(tagData));
      } else {
        promise.reject(UHF_READER_READ_ERROR, "READ FAILED");
      }

    } catch (Exception ex) {
      promise.reject(UHF_READER_READ_ERROR, ex);
    }
  }

  @ReactMethod
  public void addListener(String eventName) {

  }

  @ReactMethod
  public void removeListeners(Integer count) {

  }

  private void sendEvent(String eventName, @Nullable WritableArray array) {
    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, array);
  }

  private void sendEvent(String eventName, @Nullable String status) {
    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, status);
  }

  class TagThread extends Thread {

    String findEpc;

    public TagThread() {
      findEpc = "";
    }

    public TagThread(String findEpc) {
      this.findEpc = findEpc;
    }

    public void run() {
      String strTid;
      String strResult;
      UHFTAGInfo res = null;
      while (uhfInventoryStatus) {
        res = mReader.readTagFromBuffer();
        if (res != null) {
          if ("".equals(findEpc)) addIfNotExists(res);
          else lostTagOnly(res);
        }
      }
    }

    public void lostTagOnly(UHFTAGInfo tag) {
      String epc = tag.getEPC(); //mReader.convertUiiToEPC(tag[1]);
      if (epc.equals(findEpc)) {
        // Same Tag Found
        //tag[1] = mReader.convertUiiToEPC(tag[1]);
        String[] tagData = {tag.getEPC(), tag.getRssi()};
        sendEvent("UHF_TAG", C72RFIDScannerModule.convertArrayToWritableArray(tagData));
      }
    }

    public void addIfNotExists(UHFTAGInfo tid) {
      if (!scannedTags.contains(tid.getEPC())) {
        scannedTags.add(tid.getEPC());
        String[] tagData = {tid.getEPC(), tid.getRssi()};
        sendEvent("UHF_TAG", C72RFIDScannerModule.convertArrayToWritableArray(tagData));
      }
    }
  }

  class UhfReaderPower extends Thread {
    Boolean powerOn;

    public UhfReaderPower() {
      this.powerOn = true;
    }

    public UhfReaderPower(Boolean powerOn) {
      this.powerOn = powerOn;
    }

    public void powerOn() {
      if (mReader == null || !mReaderStatus) {
        try {
          mReader = RFIDWithUHFUART.getInstance();
          try {
            mReaderStatus = mReader.init();
            //mReader.setEPCTIDMode(true);
            mReader.setEPCAndTIDMode();
            sendEvent("UHF_POWER", "success: power on");
          } catch (Exception ex) {
            sendEvent("UHF_POWER", "failed: init error");
          }
        } catch (Exception ex) {
          sendEvent("UHF_POWER", "failed: power on error");
        }
      }
    }

    public void powerOff() {
      if (mReader != null) {
        try {
          mReader.free();
          mReader = null;
          sendEvent("UHF_POWER", "success: power off");

        } catch (Exception ex) {
          sendEvent("UHF_POWER", "failed: " + ex.getMessage());
        }
      }
    }

    public void run() {
      if (powerOn) {
        powerOn();
      } else {
        powerOff();
      }
    }
  }

  @Override
  public void onHostDestroy() {
    new UhfReaderPower(false).start();
  }

  @Override
  public void onHostResume() {
  }

  @Override
  public void onHostPause() {
  }
}
