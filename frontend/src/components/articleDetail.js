import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ArticleDetail = () => {
    const [article, setArticle] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`https://m-zbr0.onrender.com/api/articles/${id}/`)
            .then(response => setArticle(response.data))
            .catch(error => console.error('Error fetching article:', error));
    }, [id]);

    if (!article) return <div className="text-center text-gray-600">Loading...</div>;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{article.title}</h1>
            <img className="w-full h-48 md:h-64 object-cover mb-4 rounded-lg shadow-sm" src={article.image_url} alt={article.title} />
            <p className="text-gray-600 mb-2 text-sm md:text-base">{new Date(article.date).toLocaleDateString()}</p>
            <pre className="text-base md:text-lg whitespace-pre-wrap leading-relaxed text-gray-800">{article.description}</pre>
            {/* Add more article details as needed */}
        </div>
    );
};

export default ArticleDetail;
