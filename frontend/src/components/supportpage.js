import React, { useState } from 'react';
import axios from 'axios';

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://m-zbr0.onrender.com/api/submit-feedback/', formData);
      console.log(formData);
      alert("Form submitted successfully!")
    } catch (error) {
      console.error('Error:', error);
      alert("Error in form submission")
    }
  };

     

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Support</h1>

<section className="mb-12">
  <h2 className="text-2xl font-semibold mb-4">Help Center</h2>
  <div className="bg-white shadow-md rounded-lg p-6">
    <input
      type="text"
      placeholder="Search for help articles..."
      className="w-full px-4 py-2 border rounded-lg text-lg mb-4"
    />
    <h3 className="text-xl font-medium mb-3">Frequently Asked Questions</h3>
    <ul className="space-y-2">
      <li><a href="#" className="text-blue-600 hover:underline">How do I reset my password?</a></li>
      <li><a href="#" className="text-blue-600 hover:underline">What are the system requirements?</a></li>
      <li><a href="#" className="text-blue-600 hover:underline">How can I update my billing information?</a></li>
      <li><a href="#" className="text-blue-600 hover:underline">View all FAQs</a></li>
    </ul>
  </div>
</section>

<section className="mb-12">
  <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
  <div className="grid md:grid-cols-3 gap-6">
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-medium mb-3">Email Support</h3>
      <p className="mb-4">Get a response within 24 hours</p>
      <a href="#" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Send an Email</a>
    </div>
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-medium mb-3">Live Chat</h3>
      <p className="mb-4">Available Mon-Fri, 9am-5pm</p>
      <a href="#" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Start Chat</a>
    </div>
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-medium mb-3">Phone Support</h3>
      <p className="mb-4">Call us at 1-800-123-4567</p>
      <a href="tel:18001234567" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Call Now</a>
    </div>
  </div>
</section>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
              <textarea
                id="feedback"
                name="feedback"
                rows="4"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.feedback}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit Feedback</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
