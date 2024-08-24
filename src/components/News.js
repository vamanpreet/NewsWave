import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';

export default function News({
    country = 'in',
    pageSize = 3,
    category = 'general',
    apiKey,
    setProgress
}) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);


    const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    const updateNews = async () => {
        try {
            setProgress(10);
            const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page}&pageSize=${pageSize}`;
            setLoading(true);
            let response = await fetch(url);
            setProgress(30);
            if (!response.ok) throw new Error('Network response was not ok');
            let parseData = await response.json();
            setProgress(70);
            setArticles(parseData.articles);
            setTotalResults(parseData.totalResults);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    useEffect(() => {
        document.title = `${capitalize(category)} - News`;
        updateNews();
        // eslint-disable-next-line
    }, [country, category, pageSize]);

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}&page=${page + 1}&pageSize=${pageSize}`;
        const nextPage = page + 1;
        setPage(nextPage);
        try {
            let response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            let parseData = await response.json();
            setArticles(articles.concat(parseData.articles));
            setTotalResults(parseData.totalResults);
        } catch (error) {
            console.error('Error fetching more news:', error);
        }
    };

    return (
        <>
            <h1 className='text-center' style={{ margin: '2rem 0', marginTop: '5rem' }}>
                {`Top ${capitalize(category)} Headlines`}
            </h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element, index) => (
                            <div className="col-md-4" key={`${element.url}-${index}`}>
                                <NewsItem
                                    title={element.title}
                                    description={element.description ? element.description.slice(0, 88) : ""}
                                    imageUrl={element.urlToImage}
                                    newsUrl={element.url}
                                    author={element.author}
                                    date={element.publishedAt}
                                    source={element.source.name}
                                />
                                <NewsItem
                                    title={element.title}
                                    description={element.description ? element.description.slice(0, 88) : ""}
                                    imageUrl={element.urlToImage}
                                    newsUrl={element.url}
                                    author={element.author}
                                    date={element.publishedAt}
                                    source={element.source.name}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    apiKey: PropTypes.string.isRequired,
    setProgress: PropTypes.func.isRequired
};
