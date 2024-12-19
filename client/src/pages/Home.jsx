import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen w-[100vw] bg-gray-100 flex flex-col items-center justify-center">
            <header className="bg-blue-600 w-full py-4">
                <h1 className="text-white text-3xl text-center">Welcome to Our Landing Page</h1>
            </header>
            <main className="flex flex-col items-center justify-center flex-1">
                <h2 className="text-2xl font-bold mb-4">Discover Our Features</h2>
                <p className="text-gray-700 mb-8 text-center max-w-md">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                    Get Started
                </button>
            </main>
            <footer className="bg-gray-800 w-full py-4">
                <p className="text-white text-center">&copy; 2023 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;