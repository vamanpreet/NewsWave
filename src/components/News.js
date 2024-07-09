import React, { Component } from 'react'
import NewsItem from './NewsItem'

export default class News extends Component {
    constructor() {
        super();
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            pageSize: 9,
        }
    }
    async componentDidMount() {
        let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=779fdcc4a4ae4b2babe0bbaab63da4c9&page=${this.state.page}&pageSize=${this.state.pageSize}`;
        let data = await fetch(url);
        let parseData = await data.json();
        this.setState({articles : parseData.articles, totalResults: parseData.totalResults,})
    }
    
    handlePrevClick = async () => {
        let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=779fdcc4a4ae4b2babe0bbaab63da4c9&page=${this.state.page - 1}&pageSize=${this.state.pageSize}`;
        let data = await fetch(url);
        let parseData = await data.json();
        this.setState({
            page: this.state.page - 1,
            articles: parseData.articles,
        })
    }
    
    handleNextClick = async () => {
        if(this.state.page < Math.ceil(this.state.totalResults/this.state.pageSize)) {
            let url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=779fdcc4a4ae4b2babe0bbaab63da4c9&page=${this.state.page + 1}&pageSize=${this.state.pageSize}`;
            let data = await fetch(url);
            let parseData = await data.json();
            this.setState({
                page: this.state.page + 1,
                articles: parseData.articles,
            })
        }
    }

    render() {
        return (
            <div className='container my-3'>
                <h1 className='text-center'>Top Headlines</h1>
                <div className="row">
                    {this.state.articles.map((element) => (
                        <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} />
                        </div>
                    ))}
                </div>
                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}> &larr; Previous</button>
                    <button disabled={this.state.page >= Math.ceil(this.state.totalResults/this.state.pageSize)}type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </div>
        )
    }
}
