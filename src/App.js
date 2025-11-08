import React, { useState, useMemo } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles] = useState([
    {
      title: "Understanding the difference between grid-template and grid-auto",
      date: "Oct 09, 2018",
      content:
        "With all the new properties related to CSS Grid Layout, one of the distinctions that always confused me was the difference between the grid-template and grid-auto properties.",
    },
    {
      title: "Recreating the GitHub Contribution Graph with CSS Grid",
      date: "Sep 15, 2020",
      content:
        "Learn how to use CSS Grid to recreate GitHub’s famous contribution graph easily with simple CSS.",
    },
  ]);

  // State for tracking highlights
  const [currentMatch, setCurrentMatch] = useState(0);

  // Compute all matches
  const matches = useMemo(() => {
    let allMatches = [];
    if (!searchTerm) return [];

    articles.forEach((a, index) => {
      const regex = new RegExp(searchTerm, "gi");
      const titleMatches = [...a.title.matchAll(regex)];
      const contentMatches = [...a.content.matchAll(regex)];
      titleMatches.forEach(() =>
        allMatches.push({ articleIndex: index, type: "title" })
      );
      contentMatches.forEach(() =>
        allMatches.push({ articleIndex: index, type: "content" })
      );
    });
    return allMatches;
  }, [articles, searchTerm]);

  // Highlight words and track positions
  const highlightText = (text, articleIndex, type) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    let count = 0;

    return text.split(regex).map((part, i) => {
      if (regex.test(part)) {
        count++;
        const globalIndex = matches.findIndex(
          (m, idx) =>
            m.articleIndex === articleIndex &&
            m.type === type &&
            idx === count - 1
        );
        const isActive = globalIndex === currentMatch;
        return (
          <mark
            key={i}
            style={{
              backgroundColor: isActive ? "orange" : "yellow",
              fontWeight: isActive ? "bold" : "normal",
            }}
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nextMatch = () => {
    if (matches.length > 0)
      setCurrentMatch((prev) => (prev + 1) % matches.length);
  };

  const prevMatch = () => {
    if (matches.length > 0)
      setCurrentMatch(
        (prev) => (prev - 1 + matches.length) % matches.length
      );
  };

  return (
    <div className="app">
      <h2>Search</h2>
      <input
        type="text"
        placeholder="Type a keyword..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentMatch(0);
        }}
      />

      <div className="info-bar">
        <p>
          {filtered.length} posts found |{" "}
          {matches.length > 0
            ? `${currentMatch + 1} of ${matches.length}`
            : "0 of 0"}
        </p>
        {matches.length > 0 && (
          <div className="buttons">
            <button onClick={prevMatch}>◀ Prev</button>
            <button onClick={nextMatch}>Next ▶</button>
          </div>
        )}
      </div>

      {filtered.map((a, index) => (
        <div key={index} className="article">
          <h3>{highlightText(a.title, index, "title")}</h3>
          <small>{a.date}</small>
          <p>{highlightText(a.content, index, "content")}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
