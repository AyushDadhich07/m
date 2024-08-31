import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard from './articleCard';

const Articles = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        // axios.get('https://m-zbr0.onrender.com/api/articles/')
        //     .then(response => setArticles(response.data))
        //     .catch(error => console.error('Error fetching articles:', error));
            axios.get('https://localhost:8000/api/articles/')
            .then(response => setArticles(response.data))
            .catch(error => console.error('Error fetching articles:', error));
    }, []);

    return (
        <div className="flex-col flex-wrap justify-center">
            {articles.map(article => (
                <ArticleCard 
                    key={article.id}
                    id={article.id} 
                    title={article.title} 
                    description={article.description} 
                    imageUrl={article.image_url} 
                    date={article.date} 
                />
            ))}
            {/* <ArticleCard 
                    key="1"
                    title="Article 1"
                    description="This is the first article"
                    imageUrl="https://www.thesaurus.com/e/wp-content/uploads/2021/11/20211104_articles_1000x700.png"
                    date="2024-07-26" 
                /> */}
        </div>
    );
};

export default Articles;
