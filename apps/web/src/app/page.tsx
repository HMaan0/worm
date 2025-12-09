import Card from "@/components/Card";
import downloadIcon from "@/app/download.svg";
import Image from "next/image";
export default function Home() {
  return (
    <Card>
      <div className="h-full p-8 flex flex-col gap-8  justify-between items-center">
        {/* Left Section */}
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Send a WhatsApp message
          </h1>
          <p className="text-gray-600 mb-4">
            Use WhatsApp and send a message from your device to
          </p>

          <div className="flex items-center text-gray-800 text-lg mb-2">
            <span className="mr-2 text-green-500">💬</span>
            <span className="font-medium">+1 415 523 8886</span>
          </div>

          <p className="text-gray-600 mb-6">
            with code <span className="font-semibold">join harbor-cowboy</span>
          </p>
        </div>

        {/* Divider */}
        <div className=" h-px bg-gray-200 w-full mx-10" />

        {/* Right Section */}
        <div className="text-center mt-10 md:mt-0">
          <h2 className="text-xl text-gray-800 font-medium mb-4">
            Scan the QR code on mobile
          </h2>
          <div className="border rounded-lg p-3 inline-block bg-white">
            {/* You can insert the actual QR image here */}
            <Image
              src={downloadIcon}
              alt="Twilio WhatsApp Sandbox QR"
              className=" object-contain"
              width={100}
              height={100}
            />
          </div>
          <p className="text-gray-500 mt-3 text-sm">Twilio WhatsApp Sandbox</p>
        </div>
      </div>
    </Card>
  );
}
