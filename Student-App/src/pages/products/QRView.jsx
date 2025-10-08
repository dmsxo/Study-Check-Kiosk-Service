import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef } from 'react';
import { User, Settings, Bell, Mail } from 'lucide-react';

function QRView() {
  return (
    <div className="h-full min-w-fit bg-gray-50 p-4 space-y-3">
      <h1 className="font-black text-gray-900 text-xl mb-4">출석 체크</h1>
      <div className="flex flex-col items-center justify-center space-y-4"></div>
    </div>
  );
}

export default QRView;
