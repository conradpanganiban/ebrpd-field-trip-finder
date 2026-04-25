import * as React from "react"

// Define breakpoints
const MOBILE_BREAKPOINT = 690
const TABLET_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1024

// Define device types
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export function useDeviceType() {
  const [deviceType, setDeviceType] = React.useState<DeviceType>('desktop')

  React.useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth
      
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      const isMobileUA = mobileRegex.test(userAgent.toLowerCase())
      
      // Check for touch capabilities
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Determine device type based on multiple factors
      if (width < MOBILE_BREAKPOINT || (isMobileUA && width < 932)) {
        setDeviceType('mobile')
      } else if (width < TABLET_BREAKPOINT || (hasTouch && width < DESKTOP_BREAKPOINT)) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }

    // Initial check
    detectDevice()

    // Add event listener
    window.addEventListener('resize', detectDevice)
    
    // Cleanup
    return () => window.removeEventListener('resize', detectDevice)
  }, [])

  return deviceType
}

// For backward compatibility
export function useIsMobile() {
  const deviceType = useDeviceType()
  return deviceType === 'mobile'
}
