import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getStockData } from '../../services/iextradingAPI';
import { removeFavorite, addFavorite, getFavorite } from '../../services/favoritesApi';
import styles from './CompanyDetail.css';

export default class CompanyDetail extends Component {

  state = {
    company: null,
    favorite: null
  };

  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    
    getStockData(id)
      .then(company => {
        this.setState({ company: company });
      })
      .catch(console.log);

    getFavorite(id)
      .then(favorite => {
        this.setState({ favorite });
      })
      .catch(console.log);
  }

  componentDidUpdate({ location }) {
    if(location.pathname !== this.path) {
      const ticker = this.path.split('/').slice(2);
      getStockData(ticker)
        .then(company => {
          this.setState({ company: company });
        })
        .catch(console.log);
    }
  }

  get path() {
    const { location } = this.props;
    const path = location.pathname;
    return path;
  }


  handleClick = () => {
    const { company, favorite } = this.state;
    const isFavorite = !!favorite;

    if(isFavorite) {
      removeFavorite(company.company.symbol)
        .then(() => {
          this.setState({ favorite: null });
        })
        .catch(console.log);
    }
    else {
      addFavorite(company.company)
        .then(favorite => {
          this.setState({ favorite });
        })
        .catch(console.log);
    }
  };

  render() {
    const { company, favorite } = this.state;

    if(!company) return null;

    return (
      <div className={styles.companyDetail}>
        <button onClick={this.handleClick}>
          {favorite ? 'Remove from' : 'Add to' } favorites
        </button>
        <h3>Company:</h3>
        <br/>{company.book.quote.companyName}
          &nbsp;
        <a href={company.company.website} target="blank">(Company Web Site)</a>
        <p><b>CEO:</b><br/>{company.company.CEO}</p>
        <p><b>Description:</b><br/>{company.company.description}</p>
        <p>Latest Price:  {company.book.quote.latestPrice}</p>
        <p>{company.book.quote.latestSource} | {company.book.quote.latestTime}</p>
        <p>High:  {company.book.quote.high}  (52-week high: {company.book.quote.week52High})</p>
        <p>Low:  {company.book.quote.low}  (52-week low:  {company.book.quote.week52Low})</p>
        <p>Low:  {company.book.quote.low}</p>
        <p></p>
        <p></p>
        <p></p>
        <h3>News:</h3>
        <p>{company.news[0].datetime}</p>
        <p>{company.news[0].headline}</p>
        <p>{company.news[0].summary}</p>
        <a href={company.news[0].url} target="blank">(Article Link)</a>
      </div>
    );
  }
}
