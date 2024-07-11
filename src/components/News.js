import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function News (props) {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parseData = await data.json();
        props.setProgress(70);
        setArticles(parseData.articles)
        setTotalResults(parseData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }
    useEffect(() => {
        document.title = `${capitalize(props.category)} - News`;
        updateNews();
        // eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        const nextPage = page + 1
        setPage(nextPage)
        let data = await fetch(url);
        let parseData = await data.json();
        setArticles(articles.concat(parseData.articles))
        setTotalResults(parseData.totalResults)
    }

    return (
        <>
            <h1 className='text-center' style={{margin: '2rem 0', marginTop: '5rem'}}>{`Top ${capitalize(props.category)} Headlines`}</h1>
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
                                <NewsItem title={element.title} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )
}

News.defaultPropTypes = {
    country: 'in',
    pageSize: 3,
    category: 'general'
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}