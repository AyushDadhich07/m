import React from 'react';
import { ArrowRight, Check, Star, Book, Calendar } from 'lucide-react';
import { Link } from 'react-scroll';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">ESGPro</div>
            <div className="space-x-4">
              <Link to="features" smooth={true} duration={500} className="text-gray-600 hover:text-blue-600 cursor-pointer">Features</Link>
              <Link to="resources" smooth={true} duration={500} className="text-gray-600 hover:text-blue-600 cursor-pointer">Resources</Link>
              <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header> */}

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Simplify ESG Reporting, Maximize Impact</h1>
            <p className="text-xl mb-8">Our AI-powered platform helps companies manage ESG data and streamline reporting for comprehensive assessments and comparisons.</p>
            <div className="space-x-4">
              <button className="border border-white text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20" id="features">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Comprehensive Company Details & Comparisons</h2>
                <p className="text-gray-600 mb-4">Access detailed ESG profiles and compare companies seamlessly.</p>
                <a href="/company" className="text-blue-600 font-bold flex items-center hover:underline">
                  Explore Now <ArrowRight size={20} className="ml-2" />
                </a>
                <a href="/brochure.pdf" download className="text-blue-600 font-bold flex items-center hover:underline">
                  Download Brochure <ArrowRight size={20} className="ml-2 mt-2" />
                </a>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">AI-Driven ESG KPI Assessment</h2>
                <p className="text-gray-600 mb-4">Utilize AI to evaluate ESG KPIs for accurate and actionable insights.</p>
                <a href="/documentpage" className="text-blue-600 font-bold flex items-center hover:underline">
                  Discover More <ArrowRight size={20} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Most Advanced Solution */}
        <section className="bg-gray-200 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">The Most Advanced Solution on the Market</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Check size={24} className="text-green-500 mr-2" />
                  <h3 className="text-xl font-bold">AI for Enhanced Reporting Efficiency</h3>
                </div>
                <p className="text-gray-600">Our AI capabilities streamline and enhance the efficiency of your reporting processes.</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Check size={24} className="text-green-500 mr-2" />
                  <h3 className="text-xl font-bold">80% Cost Savings</h3>
                </div>
                <p className="text-gray-600">Achieve significant cost savings compared to in-house reporting.</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <Check size={24} className="text-green-500 mr-2" />
                  <h3 className="text-xl font-bold">3x Easier and Faster Processing</h3>
                </div>
                <p className="text-gray-600">Experience three times the ease and speed in processing your ESG data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">What Our Customers Say</h2>
            <div className="mb-8">
              <p className="text-xl italic mb-4">"The AI-driven insights have transformed our ESG strategy."</p>
              <p className="font-bold">- Jane Doe, Sustainability Manager</p>
            </div>
            <div className="flex justify-center space-x-8">
              {/* Replace with actual client logos */}
              <div className="w-20 h-20 bg-white rounded-full"></div>
              <div className="w-20 h-20 bg-white rounded-full"></div>
              <div className="w-20 h-20 bg-white rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Educational Resources */}
        <section className="py-20" id="resources">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Educational Resources</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <Book size={32} className="text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Webinars</h3>
                <p className="text-gray-600">Join our expert-led sessions on ESG best practices.</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <Star size={32} className="text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Ebooks</h3>
                <p className="text-gray-600">Download comprehensive guides on ESG reporting.</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <Calendar size={32} className="text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Blog</h3>
                <p className="text-gray-600">Stay updated with our latest insights and industry trends.</p>
              </div>
            </div>
            <div className="text-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700">
                Visit Our Resource Center
              </button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-200 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Revolutionize Your ESG Reporting?</h2>
            <p className="text-xl mb-8">See how our platform can transform your ESG strategy.</p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700">
              Book a Demo
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">ESGPro</h3>
              <p className="text-sm">Simplifying ESG reporting for a sustainable future.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/home" className="hover:underline">About</a></li>
                <li><a href="/support" className="hover:underline">FAQ</a></li>
                <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <p className="text-sm">123 ESG Street, Sustainability City, 12345</p>
              <p className="text-sm">info@esgpro.com</p>
              <p className="text-sm">+1 (123) 456-7890</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {/* Replace with actual social media icons */}
                <a href="#" className="hover:text-blue-400">LinkedIn</a>
                <a href="#" className="hover:text-blue-400">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
