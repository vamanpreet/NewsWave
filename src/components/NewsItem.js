import React from 'react'
import '../App.css';

export default function NewsItem (props) {

    let {title, description, imageUrl, newsUrl, source, author, date} = props;

    return (
        <div className="my-3">
            <div className="card container">
                <div style={{display:'flex', justifyContent:'flex-end', position:'absolute', right:'0'}}>
                    <span className="badge rounded-pill bg-danger" style={{left:"90%", zIndex:"1"}}>{source}</span>
                </div>
                <img src={!imageUrl? "https://s.france24.com/media/display/e6279b3c-db08-11ee-b7f5-005056bf30b7/w:1024/p:16x9/news_en_1920x1080.jpg" : imageUrl} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">{title}...</h5>
                        <p className="card-text">{description}...</p>
                        <p className="card-text"><small className="text-muted">By {author? author : "unknown"} on {new Date(date).toGMTString()}</small></p>
                        <a href={newsUrl} rel='noreferrer' target="_blank" className="btn btn-sm btn-dark">Read More</a>
                    </div>
            </div>
        </div>
    )
}
