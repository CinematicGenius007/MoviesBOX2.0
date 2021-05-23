'use strict';

const e = React.createElement;

class eachMoviecard {

	poster = '../static/noposter.jpg';
	title = 'Data Not Available';
	type = '';
	year = '';
	imdbID = '';
	Key = 0;

	constructor(jsonObject, keyValue) {
		if (jsonObject.Poster != 'N/A') {
			this.poster = jsonObject.Poster;
		}
		this.title = jsonObject.Title;
		this.type = jsonObject.Type;
		this.year = jsonObject.Year;
		this.imdbID = jsonObject.imdbID;
		this.Key = keyValue;
	}

	getReactEl = function() {
		const props = {user: {
			'poster' : this.poster, 
			'title' : this.title,
			'type' : this.type,
			'year' : this.year,
			'imdbID' : this.imdbID
		}, key : 'q' + this.Key};
		return e(Card, props);
	}

}

class Card extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return e(
			'div',
			{
				className: 'movie-card'
			},
			e(
				'div',
				{
					className: 'movie-card-poster'
				},
				e(
					'img',
					{
						className: 'movie-card-poster-background',
						src: this.props.user.poster
					}
				)
			),
			e(
				'div',
				{className: 'movie-card-info'},
				e(
					'div',
					{className: 'movie-card-title'},
					this.props.user.title
				),
				e(
					'span',
					{className: 'movie-card-year'},
					'(' + this.props.user.year + ')'
				)
			),
			e(
				'div',
				{className: 'movie-card-button'},
				e(
					'button',
					{
						className: 'btn btn-secondary',
						onClick: () => (new eachMovieEl(this.props.user.imdbID)).setRootEl()
					},
					'More Details'
				)
			),
			e(
				'div',
				{className: 'movie-card-type'},
				this.props.user.type.substring(0, 1).toUpperCase() + this.props.user.type.substring(1)
			)
		);
	}
}


class eachMovieEl {

	imdbID = '';

	constructor(imdbID) {
		this.imdbID = imdbID;
	}

	setRootEl = () => {
		console.log('setRootEl for ' + this.imdbID);
		window.open('https://www.imdb.com/title/' + this.imdbID + '/', '_blank');
	}
}


const egObject = {
	Poster: "https://m.media-amazon.com/images/M/MV5BZTg3OTczYmMtMWIxNi00NWIzLTg3ZjAtZjRkMTNkNGQ5Y2E0XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
	Title: "Riverdale",
	Type: "series",
	Year: "2017–",
	imdbID: "tt5420376"
}