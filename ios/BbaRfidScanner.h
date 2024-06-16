
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNBbaRfidScannerSpec.h"

@interface BbaRfidScanner : NSObject <NativeBbaRfidScannerSpec>
#else
#import <React/RCTBridgeModule.h>

@interface BbaRfidScanner : NSObject <RCTBridgeModule>
#endif

@end
