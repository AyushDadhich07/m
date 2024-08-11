import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ id, title, description, imageUrl, date }) => {
    return (
        <Link to={`/article/${id}`} className="block">
            <div className="flex flex-col md:flex-row w-full rounded overflow-hidden shadow-lg m-4 bg-white">
                <div className="md:w-1/3 w-full">
                    <img 
                        className="w-full h-auto object-cover md:h-full" 
                        src={imageUrl} 
                        alt={title} 
                    />
                </div>
                <div className="md:w-2/3 w-full px-6 py-4 flex flex-col justify-between">
                    <div>
                        <div className="font-bold text-xl mb-2 text-gray-900">{title}</div>
                        <p className="text-gray-700 text-base">{description}</p>
                    </div>
                    <div className="pt-4 pb-2">
                        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                            {new Date(date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ArticleCard;
