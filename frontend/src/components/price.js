import React from 'react';

const SubscriptionPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <main className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">Subscription Plans</h2>
        <div className="flex justify-center space-x-8">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h3 className="text-xl font-bold mb-4">Basic Plan</h3>
            <p className="text-gray-700 mb-4">For individuals who need essential features.</p>
            <ul className="mb-4">
              <li className="mb-2">✔ Feature 1</li>
              <li className="mb-2">✔ Feature 2</li>
              <li className="mb-2">✔ Feature 3</li>
            </ul>
            <div className="text-2xl font-bold mb-4">$9/month</div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Choose Plan</button>
          </div>

          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h3 className="text-xl font-bold mb-4">Pro Plan</h3>
            <p className="text-gray-700 mb-4">For professionals who need advanced features.</p>
            <ul className="mb-4">
              <li className="mb-2">✔ Feature 1</li>
              <li className="mb-2">✔ Feature 2</li>
              <li className="mb-2">✔ Feature 3</li>
              <li className="mb-2">✔ Feature 4</li>
            </ul>
            <div className="text-2xl font-bold mb-4">$29/month</div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Choose Plan</button>
          </div>

          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h3 className="text-xl font-bold mb-4">Enterprise Plan</h3>
            <p className="text-gray-700 mb-4">For enterprises who need all features.</p>
            <ul className="mb-4">
              <li className="mb-2">✔ Feature 1</li>
              <li className="mb-2">✔ Feature 2</li>
              <li className="mb-2">✔ Feature 3</li>
              <li className="mb-2">✔ Feature 4</li>
              <li className="mb-2">✔ Feature 5</li>
            </ul>
            <div className="text-2xl font-bold mb-4">$99/month</div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Choose Plan</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;
