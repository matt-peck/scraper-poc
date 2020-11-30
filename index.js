import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";

const app = document.querySelector("#app");

const ResultsList = ({ results, isLoading }) => {
  if (isLoading) {
    return <div>Scraping in progress...</div>;
  }

  return results.length ? (
    <ul>
      {results.map((item) => {
        return (
          <li key={item.title}>
            <a href={item.url}>
              <div>
                <img src={item.src} width="100" alt={item.title} />
                <h3>{item.title}</h3>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  ) : null;
};

const App = () => {
  const [searchValue, updateSearch] = useState("");
  const [results, updateResults] = useState([]);
  const [isLoading, updateLoading] = useState(false);

  const handleChange = (e) => {
    updateSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const search = searchValue.trim();

    if (search) {
      updateLoading(true);

      const response = await fetch("./.netlify/functions/scraper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ search }),
      });

      updateLoading(false);

      const results = await response.json();

      updateResults(results);
      console.log({ results });
    }
  };

  return (
    <Fragment>
      <h1>Ebay Scraper</h1>
      <p>
        Tell us what you are looking for and we'll give you back the top 3 ebay
        search results using web scraping!
      </p>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isLoading}>
          <input
            type="text"
            name="search"
            placeholder="Search ebay..."
            onChange={handleChange}
            value={searchValue}
          />
          <input type="submit" value="Submit" />
        </fieldset>
      </form>
      <ResultsList results={results} isLoading={isLoading} />
    </Fragment>
  );
};

ReactDOM.render(<App />, app);
