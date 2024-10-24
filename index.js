
const checkStatus = (response) => {
  if (response.ok) {
    // .ok returns true if response status is 200-299
    return response;
  }
  throw new Error('Request was either a 404 or 500');
}

const json = (response) => response.json()

const Movie = (props) => {
  const {
    Title,
    Year,
    imdbID,
    Type,
    Poster,
  } = props.movie;

  return (
    <div className="row movies">
      <div className="col-12 col-md-3 movies">
        <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
            <h4 class="title">{Title}</h4>
          </a>
          <a href={`https://www.imdb.com/title/${imdbID}/`} target="_blank">
            <img src={Poster} className="img-fluid" />
          </a>
          <p class="typeNyear">{Type} | {Year}</p>
      </div>
    </div>
  )
}

class MovieFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      results: [],
      error: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let { searchTerm } = this.state;
    searchTerm = searchTerm.trim();
    if (!searchTerm) {
      return;
    }

    fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=e6fda96f`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        if (data.Response === 'False') {
          throw new Error(data.Error);
        }

        if (data.Response === 'True' && data.Search) {
          this.setState({ results: data.Search, error: '' });
        }
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      })
  }

  render() {
    const { searchTerm, results, error } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Look for the movies</h1>
            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
                type="text"
                className="form-control mr-sm-2"
                placeholder="frozen"
                value={searchTerm}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn">Submit</button>
            </form>
            <br></br>
            {(() => {
              if (error) {
                return error;
              }
              return results.map((movie) => {
                return <Movie key={movie.imdbID} movie={movie} />;
              })
            })()}
          </div>
        </div>
      </div>
    )
  }
  // don't be lazy
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<MovieFinder />);
