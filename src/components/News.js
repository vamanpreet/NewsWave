import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'

export default class News extends Component {
    static defaultPropTypes = {
        country: 'in',
        pageSize: 3,
        category: 'general'
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }

    capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1,
        }
        document.title = `${this.capitalize(this.props.category)} - News`;
    }
    async updateNews() {
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=779fdcc4a4ae4b2babe0bbaab63da4c9&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true,})
        let data = await fetch(url);
        let parseData = await data.json();
        this.setState({
            articles : parseData.articles,
            totalResults: parseData.totalResults,
            loading: false,
        })
    }
    async componentDidMount() {
        this.updateNews();
    }
    
    handlePrevClick = async () => {
        this.setState({
            page: this.state.page - 1,
        })
        this.updateNews();
    }
    
    handleNextClick = async () => {
            this.setState({
                page: this.state.page + 1,
            })
            this.updateNews();
    }

    render() {
        return (
            <div className='container my-3'>
                <h1 className='text-center' style={{margin: '2rem 0'}}>{`Top ${this.capitalize(this.props.category)} Headlines`}</h1>
                {this.state.loading && <Spinner />}
                <div className="row">
                    {!this.state.loading && this.state.articles && this.state.articles.map((element) => (
                        <div className="col-md-4" key={element.url}>
                            <NewsItem title={element.title} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                        </div>
                    ))}
                </div>
                <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}> &larr; Previous</button>
                    <button disabled={this.state.page >= Math.ceil(this.state.totalResults/this.props.pageSize)}type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
                </div>
            </div>
        )
    }
}
