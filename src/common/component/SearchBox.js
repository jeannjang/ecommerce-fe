import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";

const SearchBox = ({ searchQuery, setSearchQuery, placeholder, field }) => {
  const [query] = useSearchParams();
  const [keyword, setKeyword] = useState(query.get(field) || "");

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      setSearchQuery({ ...searchQuery, page: 1, [field]: event.target.value });
    }
  };

  return (
    <div className="search-input-container">
      <div className="input-group">
        <span className="input-group-text border-0 bg-transparent">
          <FontAwesomeIcon icon={faSearch} />
        </span>
        <input
          type="text"
          className="form-control border-0 bg-transparent"
          placeholder={placeholder}
          onKeyPress={onCheckEnter}
          onChange={(event) => setKeyword(event.target.value)}
          value={keyword}
        />
      </div>
    </div>
  );
};

export default SearchBox;
