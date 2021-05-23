// Some global variables
let responseArray = [];
let responseArrayObject = [];
let totalResult = 0;
let currentSearch = '';
let currentFilter = '';


$(document).ready(() => {
	const pageLoader = document.getElementById("initial-page-loader");

	setTimeout(() => {console.log('Ready!')}, 1000);
	

	$('#searchText').keypress((e) => {
		if (e.which === 13) {
			const searchText = $('#searchText').val();
			currentSearch = searchText;
			const filter = $('#dropdownMenuButton').attr('data-filter-value');
			currentFilter = filter;
			getMovies(searchText, filter, 1);
			e.preventDefault();
		}
		
	});

	$('#searchbar-button').on('click', () => {
		const searchText = $('#searchText').val();
		currentSearch = searchText;
		const filter = $('#dropdownMenuButton').attr('data-filter-value');
		currentFilter = filter;
		getMovies(searchText, filter, 1);
	});

});


function changeDropDownValue(element) {
	let ddb = $('#dropdownMenuButton');
	ddb.text(element.innerText);
	ddb.attr('data-filter-value', element.dataset.filterValue);
	$('a.dropdown-item').attr('data-filter-current','false');
	element.setAttribute('data-filter-current', 'true');
}

function checkAfterEl() {
	let buttonel = document.querySelector("button.dropdown-toggle");
	let dropmenu = document.querySelector("ul.dropdown-menu");
	if (dropmenu.classList.contains("show")) {
		buttonel.blur();
	}
	else {
		dropmenu.style.transform = "translateY(45px) !important";
	}
}

function getMovies(searchText, filter, page) {
	if (page == 1) {
		responseArray.length = 0;
		responseArrayObject.length = 0;
	} 
	if (page % 6 == 1) {
		let filtervalue = filter != "All" ? "&type=" + filter.toLowerCase() : "";
		let startingPage = (Math.floor((page - 1) / 6) * 6) + 1;
		let endingPage = (Math.floor((page - 1) / 6) + 1) * 6;
		for (let i = startingPage; i <= endingPage && searchText.length > 0; i++) {
			let tempArray = [];
			axios.get('http://www.omdbapi.com/?apikey=bf86a20c&s=' + searchText + filtervalue + '&page=' + i)
			.then((response) => {
				// console.log(response);
				if (!(response.data.Response == "False")) {
					totalResult = response.data.totalResults;
				}
				response.data.Search.forEach(item => {
					tempArray.push(item);
				}); 
				responseArray[i - 1] = tempArray;
				// console.log(responseArray);
				if (i == endingPage) {
					setNavBar();
					lodeWaiter();
					setTimeout(() => {
						setRootElement(setArrayInOrder(responseArray), page);
					}, 1000);
				}
			})
			.catch((error) => {
				console.log(error);
				if (i == endingPage) {
					setNavBar();
					lodeWaiter();
					setTimeout(() => {
						setRootElement(setArrayInOrder(responseArray), page);
					}, 1000);
				}
			});
		}
	}
	else {
		setRootElement(setArrayInOrder(responseArray), page);
	}

}


function setArrayInOrder(responseArray) {
	responseArray.forEach(item => {
		item.forEach(itemEl => {
			responseArrayObject.push(itemEl);
		})
	});
	return responseArrayObject;
}


function setRootElement(response, pageIndex) {
	if (response.length > 0 && (pageIndex * 12) < (Math.ceil(response.length / 12) * 12)) {
		// console.log(response);
		let result = [];
		for (let j = (pageIndex - 1) * 12, k = 0; j < (pageIndex * 12) && j < response.length; j++, k++) {
			result.push((new eachMoviecard(response[j], k)).getReactEl());
		}
		result.push(getPagination(pageIndex, totalResult));
		// console.log(result);
		ReactDOM.render(result, document.getElementById('root'));
	}
	else {
		getMovies(currentSearch, currentFilter, pageIndex);
	}
}


function getPagination(pageIndex, totalResults) {
	let last = Math.ceil(totalResults / 12);
	return (new setPagination(pageIndex, last).getReactEl());
	// if (last == 1) {
	// 	return (new setPagination(false, false, 1, -1, -1, false, -1, false, false)).getReactEl();
	// }
	// else if (pageIndex <= 2) {
	// 	let diff = (totalResults - pageIndex);
	// 	return (new setPagination(pageIndex == 1 ? false : true, false, 1, 2, totalResults > 3 ? 3 : -1, diff > 2 ? true : false, diff > 0 ? totalResults : -1, totalResults > pageIndex ? true : false, pageIndex != 1)).getReactEl();
	// }
	// else if (pageIndex > 2) {
	// 	let diff = (totalResults - pageIndex);
	// 	return (new setPagination(true, true, pageIndex - 1, pageIndex, diff > 1 ? pageIndex + 1 : -1, diff > 2 ? true : false, diff > 0 ? totalResults : -1, totalResults > pageIndex ? true : false, pageIndex != 1)).getReactEl();
	// }
}


class setPagination {
	pgI = 1;
	lpg = 1;
	diff = 0;

	constructor(PGI, LPG) {
		this.pgI = PGI;
		this.lpg = LPG;
		this.diff = LPG - PGI;
	}

	getReactEl = () => {
		const props = {
			key : 'q13',
			'Pgi' : this.pgI,
			'Lp' : this.lpg,
			'Df' : this.diff
		};
		return e(Page, props)
	}
}

class Page extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return e(
			'nav',
			{
				className: 'p-2 mt-5 mb-5 d-flex justify-content-center align-items-center',
				'aria-label': 'Page navigation', 
				style: {flex: '1 1 100%'}},
			e(
				'ul',
				{className: 'pagination'},
				e(
					'li',
					{className: 'page-item ' + (this.props.Pgi != 1 ? '' : 'disabled')},
					e(
						'a',
						{
							className: 'page-link border-0',
							href: '#',
							tabIndex: '-1',
							'aria-disabled': '' + (this.props.Pgi != 1) + '',
							onClick: () => setRootElement(responseArrayObject, this.props.Pgi - 1)
						},
						'Previous'
					)
				),
				this.props.Pgi < 2 ? null : e(
					'li',
					{className: 'page-item'},
					e(
						'a',
						{
							className: 'page-link border-0',
							href: '#',
							onClick: () => setRootElement(responseArrayObject, 1)
						},
						'1'
					)
				),
				this.props.Pgi < 4 ? null : e(
					'li',
					{className: 'page-item floater'},
					e(
						'a',
						{className: 'page-link border-0'},
						'...'
					)
				),
				this.props.Pgi < 3 ? null : e(
					'li',
					{className: 'page-item'},
					e(
						'a',
						{
							className: 'page-link border-0',
							href: '#',
							onClick: () => setRootElement(responseArrayObject, this.props.Pgi - 1)
						},
						this.props.Pgi - 1
					)
				),
				e(
					'li',
					{className: 'page-item active'},
					e(
						'a',
						{
							className: 'page-link border-0',
						},
						'' + this.props.Pgi
					)
				),
				this.props.Df < 2 ? null : e(
					'li',
					{className: 'page-item'},
					e(
						'a',
						{
							className: 'page-link border-0',
							href: '#',
							onClick: () => setRootElement(responseArrayObject, this.props.Pgi + 1)
						},
						this.props.Pgi + 1
					)
				),
				e(
					'li',
					{className: 'page-item ' + (this.props.Df > 0 ? '' : 'disabled')},
					e(
						'a',
						{
							className: 'page-link border-0',
							href: '#',
							'aria-disabled': '' + this.props.Df == 0 + '',
							onClick: () => setRootElement(responseArrayObject, this.props.Pgi + 1)
						},
						'Next'
					)
				)
			)
		);
	}
}


function setNavBar() {

}


function lodeWaiter() {
	
}