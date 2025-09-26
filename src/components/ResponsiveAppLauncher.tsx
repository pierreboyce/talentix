'use client';

import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import AppLauncher from './AppLauncher';
import AppLauncherMobile from './AppLauncherMobile';
import ClientOnly from './ClientOnly';

export default function ResponsiveAppLauncher() {
  return (
    <ClientOnly fallback={<AppLauncher />}>
      <ResponsiveAppLauncherClient />
    </ClientOnly>
  );
}

function ResponsiveAppLauncherClient() {
  const { isMobile } = useDeviceDetection();
  return isMobile ? <AppLauncherMobile /> : <AppLauncher />;
}
