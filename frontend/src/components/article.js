import React from 'react';

const article = () => {
  return (
        <div className="container mx-auto p-4">
          <nav className="flex space-x-4 overflow-x-auto">
            <a href="#" className="py-2 px-4 text-black hover:text-black dark:text-black dark:hover:text-white">For you</a>
            <a href="#" className="py-2 px-4 text-black hover:text-black dark:text-black dark:hover:text-white">Following</a>
            <a href="#" className="py-2 px-4 text-black hover:text-black dark:text-black dark:hover:text-white">Machine Learning</a>
            <a href="#" className="py-2 px-4 text-black hover:text-black dark:text-black dark:hover:text-white">Technology</a>
            <a href="#" className="py-2 px-4 text-black hover:text-black dark:text-black dark:hover:text-white">Programming</a>
            <a href="#" className="py-2 px-4 text-black hover:text-black dark:text-black dark:hover:text-white">Data Science</a>
          </nav>
          <div className="space-y-8 mt-4">
            <div className="flex flex-col md:flex-row md:items-start border-b pb-4">
              {/* <img src="https://placehold.co/40x40" alt="Author" className="rounded-full w-10 h-10 mr-4"> */}
              <div className="flex-1">
                <div className="text-sm text-black dark:text-black">Alexander Nguyen in Level Up Coding</div>
                <h2 className="text-lg font-bold">The resume that got a software engineer a $300,000 job at Google.</h2>
                <p className="text-sm text-black dark:text-black">1-page. Well-formatted.</p>
                <div className="flex items-center text-sm text-black dark:text-black mt-2">
                  <span className="mr-2">⭐</span>
                  <span className="mr-4">Jun 1</span>
                  <span className="mr-4">8K</span>
                  <span className="mr-4">💬 89</span>
                </div>
              </div>
              {/* <img src="https://placehold.co/100x100" alt="Article Image" className="w-24 h-24 md:w-32 md:h-32 mt-4 md:mt-0 md:ml-4"> */}
            </div>
            <div className="flex flex-col md:flex-row md:items-start border-b pb-4">
              {/* <img src="https://placehold.co/40x40" alt="Author" className="rounded-full w-10 h-10 mr-4"> */}
              <div className="flex-1">
                <div className="text-sm text-black dark:text-black">Liu Zuo Lin</div>
                <h2 className="text-lg font-bold">You’re Decent At Python If You Can Answer These 7 Questions Correctly</h2>
                <p className="text-sm text-black dark:text-black"># No cheating pls!!</p>
                <div className="flex items-center text-sm text-black dark:text-black mt-2">
                  <span className="mr-2">⭐</span>
                  <span className="mr-4">Mar 6</span>
                  <span className="mr-4">5.3K</span>
                  <span className="mr-4">💬 29</span>
                </div>
              </div>
              {/* <img src="https://placehold.co/100x100" alt="Article Image" className="w-24 h-24 md:w-32 md:h-32 mt-4 md:mt-0 md:ml-4"> */}
            </div>
            <div className="flex flex-col md:flex-row md:items-start border-b pb-4">
              {/* <img src="https://placehold.co/40x40" alt="Author" className="rounded-full w-10 h-10 mr-4"> */}
              <div className="flex-1">
                <div className="text-sm text-black dark:text-black">Dylan Cooper in Stackademic</div>
                <h2 className="text-lg font-bold">Google Python Team Entirely Laid Off, Flutter Team Also “Facing the Axe”</h2>
                <p className="text-sm text-black dark:text-black">Google’s good news and bad news came very suddenly.</p>
                <div className="flex items-center text-sm text-black dark:text-black mt-2">
                  <span className="mr-2">⭐</span>
                  <span className="mr-4">May 2</span>
                  <span className="mr-4">833</span>
                  <span className="mr-4">💬 17</span>
                </div>
              </div>
              {/* <img src="https://placehold.co/100x100" alt="Article Image" className="w-24 h-24 md:w-32 md:h-32 mt-4 md:mt-0 md:ml-4"> */}
            </div>
            <div className="flex flex-col md:flex-row md:items-start border-b pb-4">
              {/* <img src="https://placehold.co/40x40" alt="Author" className="rounded-full w-10 h-10 mr-4"> */}
              <div className="flex-1">
                <div className="text-sm text-black dark:text-black">Paul is Positive in ILLUMINATION</div>
                <h2 className="text-lg font-bold">How To Detect An AI Written Article</h2>
              </div>
              {/* <img src="https://placehold.co/100x100" alt="Article Image" className="w-24 h-24 md:w-32 md:h-32 mt-4 md:mt-0 md:ml-4"> */}
            </div>
          </div>
        </div>
    )
}
export default article;