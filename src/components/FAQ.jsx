import React from "react";

const FAQ = () => {
  return (
    <div id="faq" className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
        <div className="text-xl font-semibold mb-6">Ask Us Anything</div>
        <div className="space-y-4 text-gray-700">
          <div>
            <p className="font-semibold">Q: What is Meetings-360?</p>
            <p className="text-sm">A: Meetings-360 helps you generate meeting transcriptions and integrates with tools you already use.</p>
          </div>
          <div>
            <p className="font-semibold">Q: How does it work?</p>
            <p className="text-sm">A: Upload your meeting audio or connect with a platform. We'll transcribe, summarize, and format the minutes.</p>
          </div>
          <div>
            <p className="font-semibold">Q: Is it secure?</p>
            <p className="text-sm">A: Yes, we use secure processing and don't store any sensitive audio longer than needed.</p>
          </div>
          <div>
            <p className="font-semibold">Q: What file formats do you support?</p>
            <p className="text-sm">A: We support MP3, WAV, M4A, and other common audio formats.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
