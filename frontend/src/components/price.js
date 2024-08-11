import React from 'react';

const PlanCard = ({ title, description, features, price }) => (
  <div className="bg-white p-6 rounded-md shadow-md w-full mb-8 lg:mb-0 lg:w-1/3 lg:mx-2">
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-gray-700 mb-4">{description}</p>
    <ul className="mb-4">
      {features.map((feature, index) => (
        <li key={index} className="mb-2">✔ {feature}</li>
      ))}
    </ul>
    <div className="text-2xl font-bold mb-4">{price}</div>
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition-colors">
      Choose Plan
    </button>
  </div>
);

const SubscriptionPage = () => {
  const plans = [
    {
      title: "Basic Plan",
      description: "For individuals who need essential features.",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      price: "$9/month"
    },
    {
      title: "Pro Plan",
      description: "For professionals who need advanced features.",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      price: "$29/month"
    },
    {
      title: "Enterprise Plan",
      description: "For enterprises who need all features.",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
      price: "$99/month"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <main className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">Subscription Plans</h2>
        <div className="flex flex-col lg:flex-row lg:justify-center lg:space-x-4 space-y-8 lg:space-y-0">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;