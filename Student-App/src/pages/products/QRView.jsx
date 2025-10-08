import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useRef } from 'react';
import { User, Settings, Bell, Mail } from 'lucide-react';
import TicketBackground from './test';

function QRView() {
  return (
    <div className="bg-gray-100 h-full">
      <div className="flex flex-col min-w-fit max-w-3xl p-4 space-y-3 ml-auto mr-auto">
        <h1 className="font-black text-gray-900 text-xl mb-4">출석 체크</h1>

        <TicketBackground
          notchRatioY={0.3}
          className="flex flex-col w-11/12 min-w-3xs max-w-lg ml-auto mr-auto"
        >
          <div className="flex-1 p-6">
            <h1 className="font-black text-2xl">학습 티켓</h1>
          </div>
          <div className="w-full aspect-square p-16 mb-8">
            <QRCodeSVG value="" className="size-full" />
          </div>
        </TicketBackground>
      </div>
    </div>
  );
}

export default QRView;
